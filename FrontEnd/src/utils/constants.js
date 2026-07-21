export const MOCK_RESPONSES = {
  hpcl: {
    text: "Here's the latest analysis on Hindustan Petroleum Corporation Limited (HPCL). The stock has been showing bullish momentum recently due to strong refining margins.",
    stockData: {
      ticker: "HPCL",
      companyName: "Hindustan Petroleum",
      currentPrice: 504.25,
      change: 2.35,
      marketCap: "71.5K Cr",
      peRatio: 4.8,
      high52: 594.80,
      low52: 236.45,
      recommendation: "Buy",
      confidence: 85
    }
  },
  reliance: {
    text: "Reliance Industries is currently trading near its all-time high. The conglomerate continues to see strong growth in its Jio and Retail segments.",
    stockData: {
      ticker: "RELIANCE",
      companyName: "Reliance Industries",
      currentPrice: 2950.40,
      change: -0.45,
      marketCap: "19.9L Cr",
      peRatio: 28.5,
      high52: 3024.90,
      low52: 2220.30,
      recommendation: "Hold",
      confidence: 72
    }
  },
  tcs: {
    text: "TCS reported a solid quarter with strong deal wins. Management remains cautiously optimistic about the macro environment.",
    stockData: {
      ticker: "TCS",
      companyName: "Tata Consultancy Services",
      currentPrice: 4125.60,
      change: 1.15,
      marketCap: "14.9L Cr",
      peRatio: 32.1,
      high52: 4254.75,
      low52: 3070.25,
      recommendation: "Buy",
      confidence: 78
    }
  },
  compare: {
    text: "### HPCL vs BPCL Analysis\n\nBoth **HPCL** and **BPCL** are leading OMCs in India. Currently, HPCL is favored due to slightly better valuation multiples.\n\n| Metric | HPCL | BPCL |\n|:---|:---|:---|\n| **P/E Ratio** | 4.8 | 5.2 |\n| **Div Yield** | 4.2% | 5.5% |\n| **52W Return** | +105% | +82% |\n\n*Recommendation: HPCL appears to have a slight edge in near-term potential.*"
  },
  infosys: {
    text: "Infosys experienced a recent pullback primarily due to weaker-than-expected revenue guidance for the upcoming fiscal year, reflecting cautious client spending in the US market. However, large deal wins remain robust."
  },
  default: {
    text: "I can help you analyze that. Could you provide a specific stock ticker or ask a comparative question? For example, try asking about **Reliance**, **TCS**, or comparing **HPCL vs BPCL**."
  }
};
