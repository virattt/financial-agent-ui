import os
from typing import Dict, Union

import requests
from langchain.pydantic_v1 import BaseModel, Field
from langchain_core.tools import tool

POLYGON_BASE_URL = "https://api.polygon.io/"


class GetFinancialsInput(BaseModel):
    ticker: str = Field(..., description="The ticker of the stock.")


@tool("get-financials", args_schema=GetFinancialsInput, return_direct=True)
def get_financials(ticker: str) -> Union[Dict, str]:
    """
    Get fundamental financial data, which is found in balance sheets,
    income statements, and cash flow statements for a given ticker.

    """

    api_key = os.environ.get("POLYGON_API_KEY")
    if not api_key:
        raise ValueError("Missing POLYGON_API_KEY secret.")

    url = (
        f"{POLYGON_BASE_URL}vX/reference/financials?"
        f"ticker={ticker}&"
        f"apiKey={api_key}"
    )
    response = requests.get(url)
    data = response.json()

    status = data.get("status", None)
    if status != "OK":
        raise ValueError(f"API Error: {data}")

    return data.get("results", None)
