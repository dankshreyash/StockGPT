import requests
import json

url = "http://127.0.0.1:8000/chat"

queries = [
    "Hindustan Petroleum",
    "TCS",
    "Apple",
    "Bajaj Finserv",
    "GibberishCompanyThatDoesNotExist"
]

for q in queries:
    payload = {"message": q}
    try:
        response = requests.post(url, json=payload)
        data = response.json()
        print(f"--- Query: {q} ---")
        if data.get("type") == "stock":
            print(f"Company: {data.get('company')} ({data.get('symbol')})")
            print(f"Price: {data.get('price')} {data.get('currency')}")
            print(f"Market Cap: {data.get('market_cap_display').encode('utf-8', 'ignore').decode('utf-8')}")
        else:
            print(f"Error: {data.get('message')}")
    except Exception as e:
        print(f"Request failed for {q}: {e}")
