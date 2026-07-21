from pydantic import BaseModel
from typing import Optional, Any

class ChatResponse(BaseModel):
    type: str
    company: Optional[str] = None
    symbol: Optional[str] = None
    price: Optional[float] = None
    change: Optional[float] = None
    change_percent: Optional[float] = None
    currency: Optional[str] = None
    market_cap: Optional[float] = None
    market_cap_display: Optional[str] = None
    pe: Optional[float] = None
    high52: Optional[float] = None
    low52: Optional[float] = None
    sector: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    summary: Optional[str] = None
    message: Optional[str] = None
