from app.agent.planner import determine_plan
from app.agent.router import TOOL_MAP
from app.tools.stock_tool import resolve_ticker
from app.tools.analysis_tool import generate_general_answer

def process_message(message: str) -> dict:
    plan = determine_plan(message)
    intent = plan.get("intent", "unknown")
    companies = plan.get("companies", [])
    required_tools = plan.get("required_tools", [])
    
    print(f"--- Agent Plan ---")
    print(f"Intent: {intent}")
    print(f"Companies: {companies}")
    print(f"Required Tools: {required_tools}")
    
    # Generic fallback
    if intent in ["explain", "unknown"] or not companies:
        answer = generate_general_answer(None, message)
        return {"type": "text", "message": answer}

    try:
        if intent == "comparison":
            if len(companies) < 2:
                return {"type": "error", "message": "Please specify at least two companies to compare."}
                
            ticker_a = resolve_ticker(companies[0])
            ticker_b = resolve_ticker(companies[1])
            
            if not ticker_a or not ticker_b:
                return {"type": "error", "message": "Could not resolve both companies for comparison."}
                
            stock_a = TOOL_MAP["stock_tool"](ticker_a) if "stock_tool" in required_tools else None
            stock_b = TOOL_MAP["stock_tool"](ticker_b) if "stock_tool" in required_tools else None
            
            if not stock_a or not stock_b:
                return {"type": "error", "message": "Failed to fetch stock data for comparison."}
                
            comparison_result = TOOL_MAP["comparison_tool"](stock_a, stock_b, message)
            
            return {
                "type": "comparison",
                "text": comparison_result.get("text_summary", "Comparison generated."),
                "comparisonData": comparison_result
            }
            
        else:
            # Single company focus
            primary_company = companies[0]
            ticker = resolve_ticker(primary_company)
            
            if not ticker:
                return {"type": "error", "message": f"Company '{primary_company}' not found."}
                
            context_data = {}
            response_data = {"type": intent}
            
            # Execute requested tools
            if "stock_tool" in required_tools:
                stock_data = TOOL_MAP["stock_tool"](ticker)
                if not stock_data:
                    return {"type": "error", "message": f"Could not fetch live market data for {ticker}. The data provider might be blocking cloud IPs."}
                context_data["stock"] = stock_data
                response_data["stockData"] = stock_data
                
            if "news_tool" in required_tools:
                news_data = TOOL_MAP["news_tool"](ticker)
                context_data["news"] = news_data
                response_data["newsData"] = news_data
                
            if "technical_tool" in required_tools:
                technical_data = TOOL_MAP["technical_tool"](ticker)
                context_data["technical"] = technical_data
                response_data["technicalData"] = technical_data
                
            if "financial_tool" in required_tools:
                financial_data = TOOL_MAP["financial_tool"](ticker)
                context_data["financial"] = financial_data
                response_data["financialData"] = financial_data
                
            if "chart_tool" in required_tools:
                chart_data = TOOL_MAP["chart_tool"](ticker)
                response_data["chartData"] = chart_data
                
            if "analysis_tool" in required_tools:
                analysis = TOOL_MAP["analysis_tool"](context_data, message)
                
                # Check if it returned a text string (fallback) or dict
                if isinstance(analysis, dict) and "error" not in analysis:
                    response_data["analysisData"] = analysis
                    response_data["text"] = "Here is my analysis based on the latest data:"
                elif isinstance(analysis, str):
                    response_data["text"] = analysis
                else:
                    response_data["text"] = "Analysis generated."

            # If only stock or specific tool was requested without analysis, we might lack text.
            if "text" not in response_data:
                response_data["text"] = "Here is the requested information:"
                
            return response_data
            
    except Exception as e:
        print(f"Agent Execution Error: {e}")
        return {"type": "error", "message": "An error occurred while executing the tools."}
