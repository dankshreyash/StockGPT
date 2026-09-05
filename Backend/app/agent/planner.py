import json
import time
from groq import Groq
from app.config import settings
from app.agent.prompts import PLANNER_PROMPT
from app.utils.helpers import strip_thinking_tags

client = Groq(api_key=settings.GROQ_API_KEY)
MODEL = "qwen/qwen3.6-27b"


class PlannerError(Exception):
    pass


def determine_plan(message: str, history: list = None) -> dict:
    messages = [{"role": "system", "content": PLANNER_PROMPT}]
    if history:
        for h in history[-6:]:
            messages.append({"role": h["role"], "content": h["content"]})
    messages.append({"role": "user", "content": f"User Message: {message}"})

    last_error = None
    for attempt in range(3):
        try:
            chat_completion = client.chat.completions.create(
                messages=messages,
                model=MODEL,
                response_format={"type": "json_object"},
                temperature=0.1,
            )
            content = chat_completion.choices[0].message.content
            content = strip_thinking_tags(content)
            return json.loads(content)
        except Exception as e:
            last_error = e
            print(f"Groq Planner Error (attempt {attempt + 1}/3): {type(e).__name__}: {e}")
            if attempt < 2:
                time.sleep(1 * (attempt + 1))

    raise PlannerError(f"AI planner unavailable after 3 attempts: {last_error}")
