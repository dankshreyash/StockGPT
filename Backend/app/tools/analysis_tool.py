import json
from groq import Groq
from app.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)
MODEL = "llama-3.1-8b-instant"

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
        print(f"Groq Analysis Error: {e}")
        return {"error": "Failed to generate analysis"}

def generate_general_answer(context_data: dict, user_question: str) -> str:
    prompt = f"""You are an expert AI Stock Research Agent.
Answer the following financial question clearly and concisely. You may use the provided context data if it is relevant.

Context Data:
{json.dumps(context_data, indent=2) if context_data else "None"}

User Question: {user_question}
"""
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
        print(f"Groq General Error: {e}")
        return "Failed to generate answer."
