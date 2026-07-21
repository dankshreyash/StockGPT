from fastapi import APIRouter
from app.models.request import ChatRequest
from app.agent.agent import process_message

router = APIRouter()

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    message = request.message.strip()
    return process_message(message)
