import os
from typing import Dict, Union

import requests
from langchain.pydantic_v1 import BaseModel, Field
from langchain_core.tools import tool

POLYGON_BASE_URL = "https://api.polygon.io/"


class GetLastQuote(BaseModel):
    ticker: str = Field(..., description="The ticker of the stock.")


@tool("get-last-quote", args_schema=GetLastQuote, return_direct=True)
def get_last_quote(ticker: str) -> Union[Dict, str]:
    """
    Get the most recent National Best Bid and Offer (Quote) for a ticker.
    """

    api_key = os.environ.get("POLYGON_API_KEY")
    if not api_key:
        raise ValueError("Missing POLYGON_API_KEY secret.")

    url = f"{POLYGON_BASE_URL}v2/last/nbbo/{ticker}?apiKey={api_key}"
    response = requests.get(url)
    data = response.json()

    status = data.get("status", None)
    if status != "OK":
        raise ValueError(f"API Error: {data}")

    return data.get("results", None)
