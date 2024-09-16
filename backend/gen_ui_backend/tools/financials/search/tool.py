import os
from typing import Dict, Union, List

import requests
from langchain_core.tools import tool

from .schema import SearchLineItemsInput

BASE_URL = "https://api.financialdatasets.ai/"


@tool("search-line-items", args_schema=SearchLineItemsInput, return_direct=True)
def search_line_items(
    tickers: List[str],
    line_items: List[str],
    period: str = "ttm",
    limit: int = 1,
    start_date: str = None,
    end_date: str = None
) -> Union[Dict, str]:
    """
    Search for specific financial line items across multiple company tickers over a specified time period.

    Use this tool when you need to retrieve and compare financial data for one or more companies. It's particularly useful for:
    1. Analyzing financial performance metrics across multiple companies.
    2. Tracking specific financial indicators over time for a company or set of companies.
    3. Comparing financial data between companies in the same industry.
    4. Gathering data for financial ratio calculations or trend analysis.

    Parameters:
    - tickers: List of stock tickers (e.g., ["AAPL", "GOOGL"]) to search for. Use this to specify which companies you want data for.
    - line_items: List of financial metrics (e.g., ["revenue", "net_income", "total_assets"]) to retrieve. These are the specific financial data points you're interested in.
    - period: Time period for the data. Options are "annual", "quarterly", or "ttm" (trailing twelve months). Default is "ttm".
    - limit: Maximum number of historical data points to return per ticker. Default is 1 (most recent).
    - start_date: Optional start date for the data range in YYYY-MM-DD format.
    - end_date: Optional end date for the data range in YYYY-MM-DD format.

    The function returns a dictionary containing the requested financial data for each specified ticker and line item.

    Example use cases:
    - "Compare the revenue and net income of Apple and Google for the last 5 years."
          Use: search_line_items(tickers=["AAPL", "GOOGL"], line_items=["revenue", "net_income"], period="annual", limit=5)
    - "What was Amazon's debt-to-equity ratio last quarter?"
    - "Show me the profit margins of the top 5 tech companies over the past 3 quarters."
    - "Calculate the year-over-year growth in total assets for Tesla from 2020 to 2022."

    Note: This tool accesses real financial data and should be used when specific, factual financial information is required.
    """

    api_key = os.environ.get("FINANCIAL_DATASETS_API_KEY")
    if not api_key:
        raise ValueError("Missing FINANCIAL_DATASETS_API_KEY.")

    url = f"{BASE_URL}financials/search/line-items"

    payload = {
        "tickers": tickers,
        "line_items": line_items,
        "period": period,
        "limit": limit
    }

    if start_date:
        payload["start_date"] = start_date
    if end_date:
        payload["end_date"] = end_date

    try:
        response = requests.post(
            url,
            json=payload,
            headers={'X-API-Key': api_key, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an HTTPError for bad responses
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        return {"search_results": [], "error": str(e)}
