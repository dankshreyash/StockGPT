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
    sym_a = stock_a.get('symbol', 'A')
    sym_b = stock_b.get('symbol', 'B')
    price_a = stock_a.get('price', 0)
    price_b = stock_b.get('price', 0)
    change_a = stock_a.get('change_percent', 0)
    change_b = stock_b.get('change_percent', 0)
    pe_a = stock_a.get('pe')
    pe_b = stock_b.get('pe')
    mcap_a = stock_a.get('market_cap_display', 'N/A')
    mcap_b = stock_b.get('market_cap_display', 'N/A')
    high52_a = stock_a.get('high52')
    high52_b = stock_b.get('high52')
    low52_a = stock_a.get('low52')
    low52_b = stock_b.get('low52')
    sector_a = stock_a.get('sector', 'N/A')
    sector_b = stock_b.get('sector', 'N/A')
    cur = stock_a.get('currency', '₹')
    sym = '₹' if cur == 'INR' else '$'

    def winner(va, vb):
        try:
            if float(va or 0) > float(vb or 0):
                return sym_a
            elif float(vb or 0) > float(va or 0):
                return sym_b
        except (TypeError, ValueError):
            pass
        return "Tie"

    return {
        "text_summary": f"**{company_a}** vs **{company_b}** — here is a side-by-side comparison of key metrics.",
        "comparison_table": [
            {"metric": "Price", "stock_a_value": f"{sym}{price_a:,.2f}" if price_a else "N/A", "stock_b_value": f"{sym}{price_b:,.2f}" if price_b else "N/A", "winner": winner(price_a, price_b)},
            {"metric": "Change %", "stock_a_value": f"{change_a:+.2f}%", "stock_b_value": f"{change_b:+.2f}%", "winner": winner(change_a, change_b)},
            {"metric": "P/E Ratio", "stock_a_value": f"{pe_a:.2f}" if pe_a else "N/A", "stock_b_value": f"{pe_b:.2f}" if pe_b else "N/A", "winner": winner(pe_b, pe_a)},
            {"metric": "Market Cap", "stock_a_value": mcap_a, "stock_b_value": mcap_b, "winner": winner(stock_a.get('market_cap', 0), stock_b.get('market_cap', 0))},
            {"metric": "52W High", "stock_a_value": f"{sym}{high52_a:,.2f}" if high52_a else "N/A", "stock_b_value": f"{sym}{high52_b:,.2f}" if high52_b else "N/A", "winner": winner(high52_a, high52_b)},
            {"metric": "52W Low", "stock_a_value": f"{sym}{low52_a:,.2f}" if low52_a else "N/A", "stock_b_value": f"{sym}{low52_b:,.2f}" if low52_b else "N/A", "winner": "Tie"},
            {"metric": "Sector", "stock_a_value": sector_a, "stock_b_value": sector_b, "winner": "Tie"},
        ]
    }
