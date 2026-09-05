import yfinance as yf
from yahooquery import search
from typing import Dict, Any
import re
from app.config import settings

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
    "TATA STEEL": "TATASTEEL.NS",
    "SBI": "SBIN.NS",
    "HDFC": "HDFCBANK.NS",
    "ITC": "ITC.NS"
}

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

def search_company(query: str) -> list:
    upper_query = query.upper().strip()
    if upper_query in SYMBOL_MAP:
        return [{"symbol": SYMBOL_MAP[upper_query], "quoteType": "EQUITY", "exchange": "NSI"}]

    try:
        search_results = search(query)
        quotes = search_results.get("quotes", [])
        if not quotes:
            clean_query = re.sub(r'(?i)\b(limited|ltd|corp|corporation|inc|incorporated|company|co)\b\.?', '', query).strip()
            if clean_query and clean_query != query:
                search_results = search(clean_query)
                quotes = search_results.get("quotes", [])
        return quotes
    except Exception as e:
        print(f"yahooquery search error for {query}: {e}")
        # Fallback: Alpha Vantage symbol search
        if settings.ALPHA_VANTAGE_API_KEY:
            try:
                import requests
                url = f"https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords={query}&apikey={settings.ALPHA_VANTAGE_API_KEY}"
                res = requests.get(url, timeout=10)
                matches = res.json().get("bestMatches", [])
                return [
                    {
                        "symbol": m["1. symbol"],
                        "longname": m.get("2. name", ""),
                        "shortname": m.get("2. name", ""),
                        "quoteType": "EQUITY",
                        "exchange": "NSI" if "NSI" in m.get("4. region", "") else "BSE",
                    }
                    for m in matches[:5]
                ]
            except Exception as e2:
                print(f"Alpha Vantage search error for {query}: {e2}")
        return []

def resolve_ticker(query: str) -> str:
    upper_query = query.upper().strip()
    if upper_query.endswith('.NS') or upper_query.endswith('.BO'):
        return upper_query

    quotes = search_company(query)
    if not quotes:
        return ""
    
    # Check for exact symbol match first
    upper_query = query.upper().strip()
    for q in quotes:
        if q.get('symbol', '').upper() == upper_query:
            return q.get('symbol')
            
    # Filter out ETFs and Mutual Funds unless explicitly requested
    is_etf_query = "ETF" in upper_query
    def is_valid_equity(q):
        name = (q.get('longname', '') + ' ' + q.get('shortname', '')).upper()
        if not is_etf_query and ('ETF' in name or 'MUTUAL FUND' in name or 'FUND' in name):
            return False
        return True
        
    filtered_quotes = [q for q in quotes if is_valid_equity(q)]
    if not filtered_quotes:
        filtered_quotes = quotes
    
    for q in filtered_quotes:
        if q.get('quoteType') == 'EQUITY' and q.get('exchange') == 'NSI':
            return q.get('symbol')
            
    for q in filtered_quotes:
        if q.get('quoteType') == 'EQUITY' and q.get('exchange') == 'BSE':
            return q.get('symbol')
            
    for q in filtered_quotes:
        if q.get('quoteType') == 'EQUITY':
            return q.get('symbol')
            
    return filtered_quotes[0].get('symbol')

import requests
from yahooquery import Ticker as YQTicker

def get_stock(query: str) -> Dict[str, Any]:
    ticker = resolve_ticker(query)
    if not ticker:
        return None
        
    try:
        session = requests.Session()
        session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        })
        
        stock = yf.Ticker(ticker, session=session)
        info = {}
        try:
            info = stock.info
        except Exception as e:
            print(f"yfinance info error for {ticker}: {e}")
            
        current_price = info.get('currentPrice') or info.get('regularMarketPrice')
        previous_close = info.get('regularMarketPreviousClose')
        
        if not current_price:
            try:
                fast = stock.fast_info
                current_price = fast.get('lastPrice')
                previous_close = fast.get('previousClose')
                
                # Populate info dict so the frontend doesn't show N/A
                info['marketCap'] = fast.get('marketCap')
                info['fiftyTwoWeekHigh'] = fast.get('yearHigh')
                info['fiftyTwoWeekLow'] = fast.get('yearLow')
                info['currency'] = fast.get('currency')
            except Exception as e:
                print(f"yfinance fast_info error for {ticker}: {e}")
        
        # Try history as a fallback if info is empty or blocked
        if not current_price:
            try:
                hist = stock.history(period="5d")
                if not hist.empty:
                    current_price = float(hist['Close'].iloc[-1])
                    if len(hist) > 1:
                        previous_close = float(hist['Close'].iloc[-2])
                    else:
                        previous_close = current_price
            except Exception as e:
                print(f"yfinance history error for {ticker}: {e}")
                    
        # If yfinance completely failed, try Alpha Vantage (works from cloud)
        if not current_price and settings.ALPHA_VANTAGE_API_KEY:
            try:
                symbol = ticker.split(".")[0]
                url = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={settings.ALPHA_VANTAGE_API_KEY}"
                res = requests.get(url, timeout=10)
                data = res.json().get("Global Quote", {})
                
                if data.get("05. price"):
                    current_price = float(data["05. price"])
                    previous_close = float(data.get("08. previous close", current_price))
                    info = {
                        "longName": info.get("longName") or data.get("10. name", ticker),
                        "currency": info.get("currency", "INR" if ticker.endswith(".NS") or ticker.endswith(".BO") else "USD"),
                    }
                else:
                    print(f"Alpha Vantage no data for {symbol}: {res.json()}")
            except Exception as e:
                print(f"Alpha Vantage error for {ticker}: {e}")
                    
        # If yfinance completely failed, fallback to yahooquery
        if not current_price:
            try:
                yq_ticker = YQTicker(ticker)
                price_data = yq_ticker.price.get(ticker, {})
                summary_data = yq_ticker.summary_detail.get(ticker, {})
                profile_data = yq_ticker.asset_profile.get(ticker, {})
                
                if isinstance(price_data, dict) and price_data.get('regularMarketPrice'):
                    current_price = price_data.get('regularMarketPrice')
                    previous_close = price_data.get('regularMarketPreviousClose') or current_price
                    
                    info = {
                        'currency': price_data.get('currency', 'USD'),
                        'marketCap': price_data.get('marketCap') or summary_data.get('marketCap'),
                        'longName': price_data.get('longName'),
                        'shortName': price_data.get('shortName'),
                        'trailingPE': summary_data.get('trailingPE') or summary_data.get('forwardPE'),
                        'fiftyTwoWeekHigh': summary_data.get('fiftyTwoWeekHigh'),
                        'fiftyTwoWeekLow': summary_data.get('fiftyTwoWeekLow'),
                        'sector': profile_data.get('sector'),
                        'industry': profile_data.get('industry'),
                        'website': profile_data.get('website'),
                        'longBusinessSummary': profile_data.get('longBusinessSummary')
                    }
            except Exception as e:
                print(f"yahooquery error for {ticker}: {e}")
                    
        # Ultimate fallback: Google Finance Scraping
        if not current_price:
            import urllib.parse
            from bs4 import BeautifulSoup
            
            # Map Yahoo ticker to Google Finance format
            exchange = "NSE" if ticker.endswith(".NS") else "BOM" if ticker.endswith(".BO") else "NASDAQ"
            symbol = ticker.split(".")[0]
            
            url = f"https://www.google.com/finance/quote/{urllib.parse.quote(symbol)}:{exchange}"
            try:
                res = requests.get(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"})
                soup = BeautifulSoup(res.text, 'html.parser')
                
                price_div = soup.find('div', {'class': 'YMlKec fxKbKc'}) or soup.find('div', {'class': 'N6SYTe'})
                if price_div:
                    clean_price = re.sub(r'[^\d.]', '', price_div.text)
                    current_price = float(clean_price)
                    
                name_div = soup.find('div', {'class': 'zzDege'})
                if name_div:
                    info['longName'] = name_div.text
            except Exception as e:
                print("Google Finance fallback failed:", e)

        if not current_price:
            av_status = "configured" if settings.ALPHA_VANTAGE_API_KEY else "NOT configured"
            print(f"All data sources failed for {ticker}. Alpha Vantage: {av_status}")
            return None
            
        previous_close = previous_close or current_price
        change = current_price - previous_close
        change_percent = (change / previous_close) * 100 if previous_close else 0
        
        currency = info.get('currency', 'INR' if ticker.endswith('.NS') or ticker.endswith('.BO') else 'USD')
        market_cap = info.get('marketCap') or info.get('market_cap')
        
        return {
            "type": "stock",
            "company": info.get('longName') or info.get('shortName') or ticker,
            "symbol": ticker,
            "price": float(current_price),
            "change": float(change),
            "change_percent": float(change_percent),
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
    except Exception as e:
        print(f"Error fetching stock data for {ticker}: {e}")
        return None
