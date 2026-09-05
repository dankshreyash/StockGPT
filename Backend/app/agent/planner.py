import json
import re
import time
from groq import Groq
from app.config import settings
from app.agent.prompts import PLANNER_PROMPT
from app.utils.helpers import strip_thinking_tags
from app.tools.stock_tool import SYMBOL_MAP

client = Groq(api_key=settings.GROQ_API_KEY)
MODEL = "qwen/qwen3.6-27b"

_PRONOUNS = {"it", "its", "this", "that", "which", "them", "those"}

_FOLLOW_UP_PATTERNS = [
    "should i buy", "should i sell", "should i hold",
    "buy it", "sell it", "hold it",
    "which one", "what about", "how about",
    "is it good", "is it bad", "is it worth",
    "tell me more", "more about", "analyze",
    "pros and cons", "bullish or bearish",
    "price target", "forecast", "prediction",
    "good investment", "bad investment",
    "overvalued", "undervalued",
    "buy now", "good time to buy",
]

def _extract_companies_from_text(text: str) -> list:
    companies = []
    tagged = re.findall(r'\[stock:([A-Z0-9.]+)\]', text)
    for tag in tagged:
        base = tag.split(".")[0]
        if base in SYMBOL_MAP and base not in companies:
            companies.append(base)
    words = re.findall(r'[A-Za-z]+', text)
    for w in words:
        upper = w.upper()
        if upper in SYMBOL_MAP and upper not in companies:
            companies.append(upper)
    vs_pattern = re.findall(r'(\w+)\s+vs\.?\s+(\w+)', text.lower())
    for a, b in vs_pattern:
        a_up, b_up = a.upper(), b.upper()
        if a_up in SYMBOL_MAP and a_up not in companies:
            companies.append(a_up)
        if b_up in SYMBOL_MAP and b_up not in companies:
            companies.append(b_up)
    ns_bo = re.findall(r'\b([A-Z]{2,10})\.(?:NS|BO)\b', text)
    for sym in ns_bo:
        if sym in SYMBOL_MAP and sym not in companies:
            companies.append(sym)
    return companies

def _local_plan(message: str, history: list = None) -> dict:
    lower = message.lower()
    companies = _extract_companies_from_text(message)

    has_pronoun = any(p in lower.split() for p in _PRONOUNS)
    has_follow_up = any(pat in lower for pat in _FOLLOW_UP_PATTERNS)
    is_contextual = has_pronoun or has_follow_up

    if not companies and is_contextual and history:
        for h in reversed(history):
            hist_companies = _extract_companies_from_text(h.get("content", ""))
            if hist_companies:
                companies = hist_companies
                break

    if len(companies) >= 2:
        return {"intent": "comparison", "companies": companies[:2], "required_tools": ["stock_tool", "comparison_tool"]}
    elif len(companies) == 1:
        return {"intent": "analysis", "companies": companies, "required_tools": ["stock_tool", "analysis_tool"]}
    else:
        return {"intent": "unknown", "companies": [], "required_tools": ["analysis_tool"]}

def determine_plan(message: str, history: list = None) -> dict:
    messages = [{"role": "system", "content": PLANNER_PROMPT}]
    if history:
        for h in history[-6:]:
            messages.append({"role": h["role"], "content": h["content"]})
    messages.append({"role": "user", "content": f"User Message: {message}"})

    for attempt in range(3):
        try:
            chat_completion = client.chat.completions.create(
                messages=messages,
                model=MODEL,
                response_format={"type": "json_object"},
                temperature=0.1,
            )
            content = chat_completion.choices[0].message.content
            content = strip_thinking_tags(content)
            return json.loads(content)
        except Exception as e:
            print(f"Groq Planner Error (attempt {attempt + 1}/3): {type(e).__name__}: {e}")
            if attempt < 2:
                time.sleep(1 * (attempt + 1))

    print("Groq planner failed after 3 attempts, using local fallback")
    return _local_plan(message, history)
