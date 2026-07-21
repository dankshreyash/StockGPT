import json
from groq import Groq
from app.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)

MODEL = "llama-3.1-8b-instant" # Or llama-3.3-70b-versatile

def determine_intent(message: str) -> dict:
    prompt = f"""You are an intent classifier for a stock market AI agent.
Analyze the user's message and determine their intent.
The supported intents are:
- stock (basic lookup of a stock price/info, e.g., 'Apple', 'HPCL', 'price of TSLA')
- analysis (asking for investment advice or deep analysis, e.g., 'Should I buy TCS?', 'Analyze MSFT')
- comparison (comparing two or more stocks, e.g., 'Compare Reliance and ONGC')
- news (asking for latest news, e.g., 'Latest news about Infosys', 'What is happening with AAPL')
- financials (asking for financial results, e.g., 'Show quarterly results of BEL')
- explain (asking to explain a financial term, e.g., 'What is PE Ratio?')
- unknown (none of the above)

Also extract the company names or tickers mentioned in the query.

Return ONLY a valid JSON object in this exact format:
{{
    "intent": "stock",
    "companies": ["company1", "company2"]
}}

User Message: {message}
"""
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a JSON-only API that outputs valid JSON without any markdown formatting or extra text."
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model=MODEL,
            response_format={"type": "json_object"},
            temperature=0.1,
        )
        content = chat_completion.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        print(f"Groq Intent Error: {e}")
        return {"intent": "stock", "companies": [message]}

def generate_stock_analysis(stock_data: dict, news: list, user_question: str) -> dict:
    prompt = f"""You are an expert AI Stock Research Agent.
Analyze the following live stock data and recent news to answer the user's question.
DO NOT invent or hallucinate data. ONLY use the provided data.

Stock Data:
{json.dumps(stock_data, indent=2)}

Recent News:
{json.dumps(news, indent=2)}

User Question: {user_question}

Provide your analysis in the following structured JSON format:
{{
    "recommendation": "BUY, HOLD, or SELL",
    "confidence": "A percentage, e.g., 84%",
    "summary": "A concise summary of the stock's current position and news sentiment",
    "risks": ["Risk 1", "Risk 2", "Risk 3"],
    "outlook": "Positive, Neutral, or Negative"
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

def generate_comparison(stock_a: dict, stock_b: dict, user_question: str) -> str:
    prompt = f"""You are an expert AI Stock Research Agent.
Compare the following two stocks based on the live data provided and answer the user's question.
DO NOT invent or hallucinate data.

Stock A ({stock_a.get('company')}):
{json.dumps(stock_a, indent=2)}

Stock B ({stock_b.get('company')}):
{json.dumps(stock_b, indent=2)}

User Question: {user_question}

Provide a clear, concise text explanation comparing the two companies, their metrics, and which one might be stronger based on the data.
Format your response in plain text or simple markdown (no JSON).
"""
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful financial assistant."},
                {"role": "user", "content": prompt}
            ],
            model=MODEL,
            temperature=0.4,
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Groq Comparison Error: {e}")
        return "Failed to generate comparison."

def generate_news_summary(news: list, user_question: str) -> str:
    prompt = f"""You are an expert AI Stock Research Agent.
Summarize the following recent news articles to answer the user's question.
DO NOT invent facts.

News Articles:
{json.dumps(news, indent=2)}

User Question: {user_question}

Provide a concise, easy-to-read summary of the latest events and their potential impact on the company.
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
        print(f"Groq News Error: {e}")
        return "Failed to generate news summary."

def generate_general_answer(user_question: str) -> str:
    prompt = f"""You are an expert AI Stock Research Agent.
Answer the following financial question clearly and concisely.

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
