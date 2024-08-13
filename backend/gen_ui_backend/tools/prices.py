import os
from typing import Dict, Union

import requests
from langchain.pydantic_v1 import BaseModel, Field
from langchain_core.tools import tool

BASE_URL = "https://api.financialdatasets.ai/"


class GetPricesInput(BaseModel):
    ticker: str = Field(..., description="The ticker of the stock.")
    start_date: str = Field(..., description="The start of the price time window. Either a date with the format YYYY-MM-DD or a millisecond timestamp.")
    end_date: str = Field(..., description="The end of the aggregate time window. Either a date with the format YYYY-MM-DD or a millisecond timestamp.")
    interval: str = Field(
        default="day",
        description="The time interval of the prices. Valid values are second', 'minute', 'day', 'week', 'month', 'quarter', 'year'.",
    )
    interval_multiplier: int = Field(
        default=1,
        description="The multiplier for the interval. For example, if interval is 'day' and interval_multiplier is 1, the prices will be daily. "
                    "If interval is 'minute' and interval_multiplier is 5, the prices will be every 5 minutes.",
    )
    limit: int = Field(
        default=5000,
        description="The maximum number of prices to return. The default is 5000 and the maximum is 50000.",
    )


@tool("get-prices", args_schema=GetPricesInput, return_direct=True)
def get_prices(ticker: str, start_date: str, end_date: str, interval: str, interval_multiplier: int = 1, limit: int = 5000) -> Union[Dict, str]:
    """
    Get prices for a ticker over a given date range and interval.
    """

    api_key = os.environ.get("FINANCIAL_DATASETS_API_KEY")
    if not api_key:
        raise ValueError("Missing FINANCIAL_DATASETS_API_KEY.")

    headers = {'X-API-Key': api_key}

    url = (
        f"{BASE_URL}prices"
        f"?ticker={ticker}"
        f"&start_date={start_date}"
        f"&end_date={end_date}"
        f"&interval={interval}"
        f"&interval_multiplier={interval_multiplier}"
        f"&limit={limit}"
    )

    try:
        response = requests.get(url, headers=headers)
        data = response.json()
        return data
    except Exception as e:
        return {"ticker": ticker, "prices": [], "error": str(e)}
