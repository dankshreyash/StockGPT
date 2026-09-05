from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.chat import router as chat_router
from app.config import settings

app = FastAPI(title=settings.APP_NAME)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)

@app.get("/")
def read_root():
    return {"message": f"Welcome to {settings.APP_NAME}"}

@app.get("/health")
def health_check():
    groq_configured = bool(settings.GROQ_API_KEY)
    av_configured = bool(settings.ALPHA_VANTAGE_API_KEY)
    return {
        "status": "healthy" if groq_configured else "degraded",
        "groq_api_key_configured": groq_configured,
        "alpha_vantage_api_key_configured": av_configured,
    }
