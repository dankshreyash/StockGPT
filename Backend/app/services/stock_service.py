import yfinance as yf
from yahooquery import search
from typing import Dict, Any

def format_market_cap(market_cap: float, currency: str = 'INR') -> str:
    if not market_cap:
        return "N/A"
        
    if currency == 'INR':
        in_crores = market_cap / 10000000
        return f"₹{in_crores:,.0f} Cr"
    else:
        if market_cap >= 1_000_000_000_000:
            return f"${market_cap/1_000_000_000_000:.2f}T"
        elif market_cap >= 1_000_000_000:
            return f"${market_cap/1_000_000_000:.2f}B"
        elif market_cap >= 1_000_000:
            return f"${market_cap/1_000_000:.2f}M"
        return f"${market_cap:,.0f}"

import re

SYMBOL_MAP = {
    "HPCL": "HINDPETRO.NS",
    "BPCL": "BPCL.NS",
    "RELIANCE": "RELIANCE.NS",
    "TCS": "TCS.NS",
    "INFY": "INFY.NS",
    "SBIN": "SBIN.NS",
    "HDFCBANK": "HDFCBANK.NS",
    "INFOSYS": "INFY.NS",
    "BAJAJ FINSERV": "BAJAJFINSV.NS",
    "TATA MOTORS": "TATAMOTORS.NS",
    "TATA STEEL": "TATASTEEL.NS"
}

def search_company(query: str) -> list:
    upper_query = query.upper().strip()
    if upper_query in SYMBOL_MAP:
        return [{"symbol": SYMBOL_MAP[upper_query], "quoteType": "EQUITY", "exchange": "NSI"}]

    try:
        search_results = search(query)
        quotes = search_results.get("quotes", [])
        
        if not quotes:
            # Fallback: remove common corporate suffixes
            clean_query = re.sub(r'(?i)\b(limited|ltd|corp|corporation|inc|incorporated|company|co)\b\.?', '', query).strip()
            if clean_query and clean_query != query:
                search_results = search(clean_query)
                quotes = search_results.get("quotes", [])
                
        return quotes
    except Exception:
        return []

def resolve_ticker(query: str) -> str:
    quotes = search_company(query)
    if not quotes:
        return ""
    
    # 1. Prefer NSE (.NS) equities first
    for q in quotes:
        if q.get('quoteType') == 'EQUITY' and q.get('exchange') == 'NSI':
            return q.get('symbol')
            
    # 2. Prefer BSE (.BO) equities next
    for q in quotes:
        if q.get('quoteType') == 'EQUITY' and q.get('exchange') == 'BSE':
            return q.get('symbol')
            
    # 3. Fallback to first equity found
    for q in quotes:
        if q.get('quoteType') == 'EQUITY':
            return q.get('symbol')
            
    # Fallback to first quote
    return quotes[0].get('symbol')

def get_stock_info(ticker: str) -> Dict[str, Any]:
    if not ticker:
        return None
        
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        
        current_price = info.get('currentPrice') or info.get('regularMarketPrice')
        
        if not current_price:
            return None
            
        previous_close = info.get('regularMarketPreviousClose') or current_price
        change = current_price - previous_close
        change_percent = (change / previous_close) * 100 if previous_close else 0
        
        currency = info.get('currency', 'USD')
        market_cap = info.get('marketCap')
        
        return {
            "type": "stock",
            "company": info.get('longName') or info.get('shortName') or ticker,
            "symbol": ticker,
            "price": current_price,
            "change": change,
            "change_percent": change_percent,
            "currency": currency,
            "market_cap": market_cap,
            "market_cap_display": format_market_cap(market_cap, currency),
            "pe": info.get('trailingPE') or info.get('forwardPE'),
            "high52": info.get('fiftyTwoWeekHigh'),
            "low52": info.get('fiftyTwoWeekLow'),
            "sector": info.get('sector'),
            "industry": info.get('industry'),
            "website": info.get('website'),
            "summary": info.get('longBusinessSummary')
        }
    except Exception:
        return None

def chat_handler(message: str) -> Dict[str, Any]:
    query = message.strip()
    
    ticker = resolve_ticker(query)
    if not ticker:
        return {
            "type": "error",
            "message": "Company not found."
        }
        
    stock_info = get_stock_info(ticker)
    if not stock_info:
        return {
            "type": "error",
            "message": "Company not found."
        }
        
    return stock_info
