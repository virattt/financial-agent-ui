import os
from typing import Dict, Union, List

import requests
from langchain_core.tools import tool

from backend.gen_ui_backend.tools.financials.search.schema import SearchLineItemsInput

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
    Search for financial line items for given tickers over a specified period.
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