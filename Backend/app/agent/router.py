from app.tools.stock_tool import get_stock, resolve_ticker
from app.tools.news_tool import get_news
from app.tools.financial_tool import get_financials
from app.tools.technical_tool import calculate_indicators
from app.tools.comparison_tool import compare_stocks
from app.tools.analysis_tool import generate_ai_analysis, generate_general_answer
from app.tools.chart_tool import get_chart_data

TOOL_MAP = {
    "stock_tool": get_stock,
    "news_tool": get_news,
    "financial_tool": get_financials,
    "technical_tool": calculate_indicators,
    "comparison_tool": compare_stocks,
    "analysis_tool": generate_ai_analysis,
    "chart_tool": get_chart_data
}
