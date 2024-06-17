import os
from typing import Dict, Union

import requests
from langchain.pydantic_v1 import BaseModel, Field
from langchain_core.tools import tool

POLYGON_BASE_URL = "https://api.polygon.io/"


class GetTickerNews(BaseModel):
    ticker: str = Field(..., description="The ticker of the stock.")


@tool("get-ticker-news", args_schema=GetTickerNews, return_direct=True)
def get_ticker_news(ticker: str) -> Union[Dict, str]:
    """
    Get the most recent news articles relating to a stock ticker symbol,
    including a summary of the article and a link to the original source.
    """
    api_key = os.environ.get("POLYGON_API_KEY")
    if not api_key:
        raise ValueError("Missing POLYGON_API_KEY secret.")

    url = (
        f"{POLYGON_BASE_URL}v2/reference/news?"
        f"ticker={ticker}&"
        f"apiKey={api_key}"
    )
    response = requests.get(url)
    data = response.json()

    status = data.get("status", None)
    if status != "OK":
        raise ValueError(f"API Error: {data}")

    return data.get("results", None)
