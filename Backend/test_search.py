from yahooquery import search
import json
print(json.dumps(search("HPCL"), indent=2))
print(json.dumps(search("Infosys"), indent=2))
