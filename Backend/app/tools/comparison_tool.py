import json
import time
from groq import Groq
from app.config import settings
from app.utils.helpers import strip_thinking_tags

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
    for attempt in range(3):
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
            content = strip_thinking_tags(content)
            return json.loads(content)
        except Exception as e:
            print(f"Groq Comparison Error (attempt {attempt + 1}/3): {type(e).__name__}: {e}")
            if attempt < 2:
                time.sleep(1 * (attempt + 1))

    company_a = stock_a.get('company', 'Stock A')
    company_b = stock_b.get('company', 'Stock B')
    price_a = stock_a.get('price', 'N/A')
    price_b = stock_b.get('price', 'N/A')
    change_a = stock_a.get('change_percent', 0)
    change_b = stock_b.get('change_percent', 0)
    pe_a = stock_a.get('pe', 'N/A')
    pe_b = stock_b.get('pe', 'N/A')
    mcap_a = stock_a.get('market_cap_display', 'N/A')
    mcap_b = stock_b.get('market_cap_display', 'N/A')

    return {
        "text_summary": f"**{company_a}** is trading at {price_a} ({change_a:+.2f}%), P/E: {pe_a}, Market Cap: {mcap_a}.\n\n**{company_b}** is trading at {price_b} ({change_b:+.2f}%), P/E: {pe_b}, Market Cap: {mcap_b}.\n\nThe AI comparison service is temporarily unavailable, but here is the raw data side by side.",
        "comparison_table": [
            {"metric": "Price", "stock_a_value": str(price_a), "stock_b_value": str(price_b), "winner": company_a if change_a > change_b else company_b if change_b > change_a else "Tie"},
            {"metric": "Change %", "stock_a_value": f"{change_a:+.2f}%", "stock_b_value": f"{change_b:+.2f}%", "winner": company_a if change_a > change_b else company_b if change_b > change_a else "Tie"},
            {"metric": "P/E Ratio", "stock_a_value": str(pe_a), "stock_b_value": str(pe_b), "winner": "Tie"},
            {"metric": "Market Cap", "stock_a_value": str(mcap_a), "stock_b_value": str(mcap_b), "winner": "Tie"},
        ]
    }
