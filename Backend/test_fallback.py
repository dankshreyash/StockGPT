import re
from yahooquery import search

def search_with_fallback(query: str):
    # Try exact match first
    res = search(query)
    quotes = res.get("quotes", [])
    if quotes:
        return quotes
        
    # Remove common suffixes
    clean_query = re.sub(r'(?i)\b(limited|ltd|corp|corporation|inc|incorporated|company|co)\b\.?', '', query).strip()
    if clean_query and clean_query != query:
        print(f"Fallback search with: {clean_query}")
        res = search(clean_query)
        return res.get("quotes", [])
        
    return []

print("Result for 'Bajaj Finserv Limited':", len(search_with_fallback("Bajaj Finserv Limited")))
