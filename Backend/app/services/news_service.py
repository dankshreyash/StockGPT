import yfinance as yf
from typing import List, Dict, Any

def get_latest_news(ticker: str) -> List[Dict[str, Any]]:
    if not ticker:
        return []
        
    try:
        stock = yf.Ticker(ticker)
        news_items = stock.news
        if not news_items:
            return []
            
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
                
        return formatted_news
    except Exception as e:
        print(f"Error fetching news for {ticker}: {e}")
        return []
