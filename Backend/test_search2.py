from yahooquery import search
res = search("TCS")
quotes = res.get("quotes", [])
for quote in quotes:
    print(f"  {quote.get('symbol')} ({quote.get('quoteType')}) - {quote.get('shortname')} - {quote.get('exchange')}")
