import json
import time
from groq import Groq
from app.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)
MODEL = "qwen/qwen3.6-27b"

def generate_ai_analysis(context_data: dict, user_question: str) -> dict:
    prompt = f"""You are an expert AI Stock Research Agent.
Analyze the following context data (which may include stock info, news, technicals, or financials) to answer the user's question.
DO NOT invent or hallucinate data. ONLY use the provided data to make educated estimations where necessary.

Context Data:
{json.dumps(context_data, indent=2)}

User Question: {user_question}

Provide your analysis in the following structured JSON format:
{{
    "ai_score": 84, // Integer 0-100
    "score_label": "Bullish", // Bullish, Neutral, Bearish
    "summary": "A concise summary of the stock's current position and investment potential",
    "strengths": ["Strength 1", "Strength 2", "Strength 3"],
    "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
    "forecast": {{
        "current_price": 100.50, // Float
        "expected_3m": 110.00,   // Float estimation
        "expected_6m": 115.00,   // Float estimation
        "expected_1y": 125.00,   // Float estimation
        "upside_probability": "75%",
        "downside_risk": "15%"
    }},
    "risk_analysis": [
        {{ "name": "High PE Risk", "level": "High" }},
        {{ "name": "Market Volatility", "level": "Medium" }}
    ]
}}
"""
    for attempt in range(3):
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a JSON-only API that outputs valid JSON without any markdown formatting or extra text."},
                    {"role": "user", "content": prompt}
                ],
                model=MODEL,
                response_format={"type": "json_object"},
                temperature=0.3,
            )
            content = chat_completion.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            print(f"Groq Analysis Error (attempt {attempt + 1}/3): {type(e).__name__}: {e}")
            if attempt < 2:
                time.sleep(1 * (attempt + 1))
    return {"error": "Failed to generate analysis. The AI service may be temporarily unavailable."}

def generate_general_answer(context_data: dict, user_question: str) -> str:
    prompt = f"""You are an expert AI Stock Research Agent.
Answer the following financial question clearly and concisely. You may use the provided context data if it is relevant.

Context Data:
{json.dumps(context_data, indent=2) if context_data else "None"}

User Question: {user_question}
"""
    for attempt in range(3):
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a helpful financial assistant."},
                    {"role": "user", "content": prompt}
                ],
                model=MODEL,
                temperature=0.3,
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            print(f"Groq General Error (attempt {attempt + 1}/3): {type(e).__name__}: {e}")
            if attempt < 2:
                time.sleep(1 * (attempt + 1))
    return "The AI service is temporarily unavailable. Please try again in a moment."
