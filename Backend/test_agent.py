import json
from app.agent.agent import process_message

queries = [
    "Analyze TCS technically",
    "Show quarterly results of Infosys",
    "Should I buy HPCL now?",
    "Compare Reliance and ONGC."
]

for q in queries:
    print(f"\n======================================")
    print(f"Query: {q}")
    print(f"======================================")
    response = process_message(q)
    print(json.dumps(response, indent=2)[:800] + "...\n")
