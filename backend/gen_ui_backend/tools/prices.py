import os
from typing import Dict, Union

import requests
from langchain.pydantic_v1 import BaseModel, Field
from langchain_core.tools import tool

POLYGON_BASE_URL = "https://api.polygon.io/"


class GetPricesInput(BaseModel):
    ticker: str = Field(..., description="The ticker of the stock.")
    from_date: str = Field(..., description="The start of the price time window. Either a date with the format YYYY-MM-DD or a millisecond timestamp.")
    to_date: str = Field(..., description="The end of the aggregate time window. Either a date with the format YYYY-MM-DD or a millisecond timestamp.")


@tool("get-prices", args_schema=GetPricesInput, return_direct=True)
def get_prices(ticker: str, from_date: str, to_date: str) -> Union[Dict, str]:
    """
    Get aggregate bars (stock prices) for a stock over a
    given date range for a given ticker from Polygon.
    """

    api_key = os.environ.get("POLYGON_API_KEY")
    if not api_key:
        raise ValueError("Missing POLYGON_API_KEY secret.")

    url = (
        f"${POLYGON_BASE_URL}v2/aggs/ticker/"
        f"${ticker}/range/1/"
        f"day/${from_date}/${to_date}"
        f"?adjusted=true"
        f"&sort=asc"
        f"&limit=25"
        f"&apiKey=${api_key}"
    )
    response = requests.get(url)
    data = response.json()

    status = data.get("status", None)
    if status != "OK":
        raise ValueError(f"API Error: {data}")

    return data.get("results", None)
