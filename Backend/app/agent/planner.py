import json
import time
from groq import Groq
from app.config import settings
from app.agent.prompts import PLANNER_PROMPT
from app.utils.helpers import strip_thinking_tags

client = Groq(api_key=settings.GROQ_API_KEY)
MODEL = "qwen/qwen3.6-27b"

def _local_plan(message: str) -> dict:
    lower = message.lower()
    companies = []

    import re
    words = re.findall(r'[A-Za-z]+', message)
    for w in words:
        upper = w.upper()
        from app.tools.stock_tool import SYMBOL_MAP
        if upper in SYMBOL_MAP:
            companies.append(upper)

    vs_pattern = re.findall(r'(\w+)\s+vs\.?\s+(\w+)', lower)
    for a, b in vs_pattern:
        a_up, b_up = a.upper(), b.upper()
        if a_up not in companies:
            companies.append(a_up)
        if b_up not in companies:
            companies.append(b_up)

    if len(companies) >= 2:
        return {"intent": "comparison", "companies": companies[:2], "required_tools": ["stock_tool", "comparison_tool"]}
    elif len(companies) == 1:
        return {"intent": "stock", "companies": companies, "required_tools": ["stock_tool", "analysis_tool"]}
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
    return _local_plan(message)
