import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    APP_NAME: str = "StockGPT Backend"
    DEBUG_MODE: bool = os.getenv("DEBUG_MODE", "True").lower() in ("true", "1", "t")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    ALPHA_VANTAGE_API_KEY: str = os.getenv("ALPHA_VANTAGE_API_KEY", "")

settings = Settings()
