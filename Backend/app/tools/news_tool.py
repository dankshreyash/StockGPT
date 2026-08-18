import json
import yfinance as yf
from typing import List, Dict, Any
from groq import Groq
from app.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)
MODEL = "qwen/qwen3.6-27b"

def analyze_sentiment(news_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not news_items:
        return []
    
    prompt = f"""You are a financial news sentiment analyzer. 
Analyze the following news articles and classify their sentiment toward the subject company.
Respond with a JSON array of objects exactly matching the input length. 
Each object must have: 
"sentiment" (Positive, Neutral, or Negative), and 
"confidence" (percentage, e.g. "85%").

News Articles:
{json.dumps([{ "title": n["title"], "summary": n["summary"] } for n in news_items], indent=2)}
"""
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a JSON-only API that outputs valid JSON without any markdown formatting."},
                {"role": "user", "content": prompt}
            ],
            model=MODEL,
            response_format={"type": "json_object"},
            temperature=0.1,
        )
        content = chat_completion.choices[0].message.content
        # Groq json_object might return an object like {"results": [...]}. Let's prompt it to return {"results": ...}
    except Exception as e:
        print(f"Groq Sentiment Error: {e}")
        return news_items
    pass

def analyze_sentiment_robust(news_items: List[Dict[str, Any]]) -> dict:
    if not news_items:
        return {"articles": [], "overall_sentiment": "Neutral", "positive_percent": "0%"}
    
    prompt = f"""You are a financial news sentiment analyzer. 
Analyze the following news articles. 
Return ONLY a valid JSON object with:
"articles": an array of objects (one for each input article) containing "sentiment" (Positive, Neutral, Negative) and "confidence" (e.g. "85%").
"overall_sentiment": (Positive, Neutral, Negative)
"positive_percent": (Percentage of overall positive sentiment, e.g. "78%")

Articles:
{json.dumps([{ "title": n["title"], "summary": n["summary"] } for n in news_items], indent=2)}
"""
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a JSON API. Output valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            model=MODEL,
            response_format={"type": "json_object"},
            temperature=0.1,
        )
        content = chat_completion.choices[0].message.content
        data = json.loads(content)
        
        # Merge sentiment back into news items
        articles_sentiment = data.get("articles", [])
        for i, item in enumerate(news_items):
            if i < len(articles_sentiment):
                item["sentiment"] = articles_sentiment[i].get("sentiment", "Neutral")
                item["confidence"] = articles_sentiment[i].get("confidence", "50%")
            else:
                item["sentiment"] = "Neutral"
                item["confidence"] = "50%"
                
        return {
            "articles": news_items,
            "overall_sentiment": data.get("overall_sentiment", "Neutral"),
            "positive_percent": data.get("positive_percent", "50%")
        }
    except Exception as e:
        print(f"Groq Sentiment Error: {e}")
        return {"articles": news_items, "overall_sentiment": "Neutral", "positive_percent": "50%"}


def get_news(ticker: str) -> Dict[str, Any]:
    if not ticker:
        return {"articles": [], "overall_sentiment": "Neutral", "positive_percent": "0%"}
        
    try:
        stock = yf.Ticker(ticker)
        news_items = stock.news
        if not news_items:
            return {"articles": [], "overall_sentiment": "Neutral", "positive_percent": "0%"}
            
        formatted_news = []
        for item in news_items[:5]:
            content = item.get("content", {})
            title = content.get("title", "")
            summary = content.get("summary", "")
            provider = content.get("provider", {})
            source = provider.get("displayName", "Unknown")
            pub_date = content.get("pubDate", "")
            
            url_data = content.get("clickThroughUrl") or content.get("canonicalUrl") or {}
            url = url_data.get("url", "")
            
            if title and url:
                formatted_news.append({
                    "title": title,
                    "source": source,
                    "published_date": pub_date,
                    "summary": summary,
                    "url": url
                })
                
        # Call LLM for sentiment
        return analyze_sentiment_robust(formatted_news)
    except Exception as e:
        print(f"Error fetching news for {ticker}: {e}")
        return {"articles": [], "overall_sentiment": "Neutral", "positive_percent": "0%"}
