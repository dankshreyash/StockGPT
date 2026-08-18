import json
from groq import Groq
from app.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)
MODEL = "qwen/qwen3.6-27b"

def compare_stocks(stock_a: dict, stock_b: dict, user_question: str) -> dict:
    prompt = f"""You are an expert AI Stock Research Agent.
Compare the following two stocks based on the live data provided and answer the user's question.
DO NOT invent or hallucinate data.

Stock A ({stock_a.get('company')}):
{json.dumps(stock_a, indent=2)}

Stock B ({stock_b.get('company')}):
{json.dumps(stock_b, indent=2)}

User Question: {user_question}

Provide your analysis in the following structured JSON format:
{{
    "text_summary": "A clear, concise text explanation comparing the two companies.",
    "comparison_table": [
        {{ "metric": "Market Cap", "stock_a_value": "100B", "stock_b_value": "120B", "winner": "Stock B" }},
        {{ "metric": "P/E Ratio", "stock_a_value": "15", "stock_b_value": "20", "winner": "Stock A" }}
    ]
}}
Ensure the "winner" field contains the exact string name of the winning stock, or "Tie". Make sure to compare at least 5 key metrics (Market Cap, PE, Growth, EPS, etc.).
"""
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a JSON-only API that outputs valid JSON without any markdown formatting."},
                {"role": "user", "content": prompt}
            ],
            model=MODEL,
            response_format={"type": "json_object"},
            temperature=0.2,
        )
        content = chat_completion.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        print(f"Groq Comparison Error: {e}")
        return {"error": "Failed to generate comparison."}
