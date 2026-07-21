import yfinance as yf
import pandas as pd
from typing import Dict, Any

def get_chart_data(ticker: str) -> Dict[str, Any]:
    if not ticker:
        return {}
    
    try:
        stock = yf.Ticker(ticker)
        # Fetch 1 year of data for chart
        hist = stock.history(period="1y")
        
        if hist.empty:
            return {}
            
        chart_data = []
        for index, row in hist.iterrows():
            chart_data.append({
                "date": index.strftime('%Y-%m-%d'),
                "open": round(row['Open'], 2),
                "high": round(row['High'], 2),
                "low": round(row['Low'], 2),
                "close": round(row['Close'], 2),
                "volume": int(row['Volume'])
            })
            
        # Moving averages over the full dataset
        close_series = hist['Close']
        sma50 = close_series.rolling(window=50).mean()
        sma200 = close_series.rolling(window=200).mean()
        
        for i in range(len(chart_data)):
            if not pd.isna(sma50.iloc[i]):
                chart_data[i]['sma50'] = round(sma50.iloc[i], 2)
            if not pd.isna(sma200.iloc[i]):
                chart_data[i]['sma200'] = round(sma200.iloc[i], 2)
                
        return {
            "historical": chart_data
        }
    except Exception as e:
        print(f"Error fetching chart data for {ticker}: {e}")
        return {}
