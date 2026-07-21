import json
from groq import Groq
from app.config import settings
from app.agent.prompts import PLANNER_PROMPT

client = Groq(api_key=settings.GROQ_API_KEY)
MODEL = "llama-3.1-8b-instant"

def determine_plan(message: str) -> dict:
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": PLANNER_PROMPT},
                {"role": "user", "content": f"User Message: {message}"}
            ],
            model=MODEL,
            response_format={"type": "json_object"},
            temperature=0.1,
        )
        content = chat_completion.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        print(f"Groq Planner Error: {e}")
        return {
            "intent": "unknown", 
            "companies": [], 
            "required_tools": ["analysis_tool"]
        }
