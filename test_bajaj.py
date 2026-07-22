import yfinance as yf

ticker = "BAJAJ-AUTO.NS"
stock = yf.Ticker(ticker)

try:
    info = stock.info
    print("info success, keys:", len(info.keys()))
except Exception as e:
    print("info error:", e)

try:
    fast = stock.fast_info
    print("fast_info success, market_cap:", fast.get('marketCap'))
except Exception as e:
    print("fast_info error:", e)

try:
    hist = stock.history(period="5d")
    print("history success, empty:", hist.empty)
except Exception as e:
    print("history error:", e)
