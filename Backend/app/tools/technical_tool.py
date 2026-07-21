import yfinance as yf
import pandas as pd
from typing import Dict, Any

def calculate_rsi(data: pd.Series, periods: int = 14) -> float:
    delta = data.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=periods).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=periods).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi.iloc[-1]

def calculate_macd(data: pd.Series, short_window: int = 12, long_window: int = 26, signal_window: int = 9) -> Dict[str, float]:
    short_ema = data.ewm(span=short_window, adjust=False).mean()
    long_ema = data.ewm(span=long_window, adjust=False).mean()
    macd_line = short_ema - long_ema
    signal_line = macd_line.ewm(span=signal_window, adjust=False).mean()
    histogram = macd_line - signal_line
    return {
        "macd": macd_line.iloc[-1],
        "signal": signal_line.iloc[-1],
        "histogram": histogram.iloc[-1]
    }

def calculate_indicators(ticker: str) -> Dict[str, Any]:
    if not ticker:
        return {}
        
    try:
        stock = yf.Ticker(ticker)
        # Fetch 1 year of daily data to ensure we have enough for 52-week highs and 50-day moving averages
        history = stock.history(period="1y")
        
        if history.empty or len(history) < 50:
            return {}
            
        close = history['Close']
        high = history['High']
        low = history['Low']
        
        # Calculate moving averages
        sma20 = close.rolling(window=20).mean().iloc[-1]
        sma50 = close.rolling(window=50).mean().iloc[-1]
        ema20 = close.ewm(span=20, adjust=False).mean().iloc[-1]
        ema50 = close.ewm(span=50, adjust=False).mean().iloc[-1]
        
        # Calculate RSI and MACD
        rsi = calculate_rsi(close)
        macd_data = calculate_macd(close)
        
        # 52 Week High / Low
        high_52w = high.max()
        low_52w = low.min()
        
        current_price = close.iloc[-1]
        
        # Calculate basic support and resistance based on recent pivot points (simplified: 20-day high/low)
        recent_history = history.tail(20)
        resistance = recent_history['High'].max()
        support = recent_history['Low'].min()
        
        # Determine Trend
        trend = "Neutral"
        if current_price > sma20 and current_price > sma50 and sma20 > sma50:
            trend = "Bullish"
        elif current_price < sma20 and current_price < sma50 and sma20 < sma50:
            trend = "Bearish"
            
        return {
            "rsi": round(rsi, 2),
            "macd": round(macd_data['macd'], 2),
            "macd_signal": round(macd_data['signal'], 2),
            "sma20": round(sma20, 2),
            "sma50": round(sma50, 2),
            "ema20": round(ema20, 2),
            "ema50": round(ema50, 2),
            "high_52w": round(high_52w, 2),
            "low_52w": round(low_52w, 2),
            "support": round(support, 2),
            "resistance": round(resistance, 2),
            "trend": trend
        }
    except Exception as e:
        print(f"Error calculating technical indicators for {ticker}: {e}")
        return {}
