from app.services.groq_service import determine_intent
import json

queries = [
    "Should I buy HPCL now?",
    "Compare Reliance and TCS",
    "Latest news about Infosys",
    "What is PE ratio?"
]

for q in queries:
    print(q)
    print(json.dumps(determine_intent(q)))
