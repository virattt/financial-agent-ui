import os
from typing import Dict, Union

import requests
from langchain_core.tools import tool

from .schema import InsiderTransactionsInput

BASE_URL = "https://api.financialdatasets.ai/"


@tool("insider-transactions", args_schema=InsiderTransactionsInput, return_direct=True)
def insider_transactions(
    ticker: str,
    limit: int = 100,
) -> Union[Dict, str]:
    """
    Fetches insider transactions for a given stock ticker.
    An insider transaction is a transaction conducted by an individual or entity that
    has access to non-public information about a company like officers, directors, or large shareholders.

    This endpoint returns the most recent insider transactions including the name of the insider, their title, the transaction date,
    tbe number of shares traded, the price per share, the total value of the transaction, shares owned before the transaction,
    and shares owned after the transaction.
    """

    api_key = os.environ.get("FINANCIAL_DATASETS_API_KEY")
    if not api_key:
        raise ValueError("Missing FINANCIAL_DATASETS_API_KEY.")

    url = (f"https://api.financialdatasets.ai/insider-transactions"
           f"?ticker={ticker}"
           f"&limit={limit}")


    try:
        response = requests.get(
            url,
            headers={'X-API-Key': api_key, 'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an HTTPError for bad responses
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        return {"search_results": [], "error": str(e)}