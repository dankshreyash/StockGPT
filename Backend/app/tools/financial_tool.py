import yfinance as yf
from typing import Dict, Any

def get_financials(ticker: str) -> Dict[str, Any]:
    if not ticker:
        return {}
        
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        
        # Get quarterly financials (Income Statement)
        q_fin = stock.quarterly_financials
        q_bs = stock.quarterly_balance_sheet
        
        latest_date = None
        revenue = None
        net_income = None
        operating_income = None
        ebitda = None
        total_assets = None
        total_liabilities = None
        
        if not q_fin.empty:
            latest_date = q_fin.columns[0]
            
            def safe_get(df, row_name, col):
                try:
                    if row_name in df.index:
                        val = df.loc[row_name, col]
                        if not type(val) is str and not __import__('pandas').isna(val):
                            return float(val)
                except Exception:
                    pass
                return None

            revenue = safe_get(q_fin, "Total Revenue", latest_date)
            net_income = safe_get(q_fin, "Net Income", latest_date)
            operating_income = safe_get(q_fin, "Operating Income", latest_date)
            ebitda = safe_get(q_fin, "EBITDA", latest_date)
            
            if not q_bs.empty:
                total_assets = safe_get(q_bs, "Total Assets", latest_date)
                total_liabilities = safe_get(q_bs, "Total Liabilities Net Minority Interest", latest_date)
        
        net_margin = (net_income / revenue * 100) if revenue and net_income else None
        
        def format_currency(val):
            if val is None: return "N/A"
            if abs(val) >= 1_000_000_000_000:
                return f"{val/1_000_000_000_000:.2f}T"
            elif abs(val) >= 1_000_000_000:
                return f"{val/1_000_000_000:.2f}B"
            elif abs(val) >= 1_000_000:
                return f"{val/1_000_000:.2f}M"
            return f"{val:,.0f}"

        return {
            "quarter_ended": latest_date.strftime('%Y-%m-%d') if hasattr(latest_date, 'strftime') else str(latest_date),
            "revenue": format_currency(revenue),
            "net_income": format_currency(net_income),
            "operating_income": format_currency(operating_income),
            "ebitda": format_currency(ebitda),
            "total_assets": format_currency(total_assets),
            "total_liabilities": format_currency(total_liabilities),
            "net_margin": f"{net_margin:.2f}%" if net_margin is not None else "N/A",
            
            # New Premium Metrics from .info
            "eps": info.get("trailingEps"),
            "roe": f"{info.get('returnOnEquity', 0) * 100:.2f}%" if info.get('returnOnEquity') else "N/A",
            "debt_to_equity": info.get("debtToEquity"),
            "operating_margin": f"{info.get('operatingMargins', 0) * 100:.2f}%" if info.get('operatingMargins') else "N/A",
            "cash_flow": format_currency(info.get("freeCashflow") or info.get("operatingCashflow")),
            "market_cap": format_currency(info.get("marketCap")),
            "pe": info.get("trailingPE"),
            "pb": info.get("priceToBook"),
            "dividend_yield": f"{info.get('dividendYield', 0) * 100:.2f}%" if info.get('dividendYield') else "N/A",
            "revenue_growth": f"{info.get('revenueGrowth', 0) * 100:.2f}%" if info.get('revenueGrowth') else "N/A",
            "earnings_growth": f"{info.get('earningsGrowth', 0) * 100:.2f}%" if info.get('earningsGrowth') else "N/A",
        }
    except Exception as e:
        print(f"Error fetching financials for {ticker}: {e}")
        return {}
