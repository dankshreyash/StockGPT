import time
import requests
from bs4 import BeautifulSoup
from fastapi import APIRouter
from app.models.request import ChatRequest
from app.agent.agent import process_message

router = APIRouter()

_cached_prompts = None
_last_fetch_time = 0

@router.get("/trending-prompts")
async def get_trending_prompts():
    global _cached_prompts, _last_fetch_time
    
    # Cache for 1 hour
    if _cached_prompts and (time.time() - _last_fetch_time < 3600):
        return {"prompts": _cached_prompts}
        
    try:
        res = requests.get('https://www.google.com/finance/', headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        })
        soup = BeautifulSoup(res.text, 'html.parser')
        
        # Google Finance trending class is usually ZvmM7
        trending_elements = soup.find_all('div', {'class': 'ZvmM7'})
        trending_stocks = [el.text for el in trending_elements if el.text]
        
        if len(trending_stocks) >= 3:
            s1 = trending_stocks[0]
            s2 = trending_stocks[1]
            s3 = trending_stocks[2]
            
            # Clean up long names like 'Dow Jones Industrial Average'
            prompts = [
                f"Should I invest in {s1} right now?",
                f"Analyze {s2} financial health",
                f"Compare {s1} vs {s3}",
                f"What are the latest news for {s2}?",
                f"Technical analysis for {s1}"
            ]
        else:
            raise Exception("No trending stocks found")
            
        _cached_prompts = prompts
        _last_fetch_time = time.time()
        return {"prompts": prompts}
    except Exception as e:
        print("Failed to fetch trending prompts:", e)
        # Fallback to defaults
        return {"prompts": [
            "HPCL",
            "Reliance",
            "TCS",
            "Compare HPCL vs BPCL",
            "Why did Infosys fall?"
        ]}

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    message = request.message.strip()
    return process_message(message)
