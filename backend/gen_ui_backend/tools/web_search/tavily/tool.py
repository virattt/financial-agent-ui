import os
from typing import Dict, Union

import requests
from langchain_core.tools import tool

from .schema import TavilySearchInput

TAVILY_BASE_URL = "https://api.tavily.com"


@tool("search-web", args_schema=TavilySearchInput, return_direct=True)
def search_web(
    query: str,
    search_depth: str = "basic",
    topic: str = "general",
    days: int = 3,
    max_results: int = 3,
    include_images: bool = False,
    include_answer: bool = False,
    include_raw_content: bool = False,
    include_domains: list = None,
    exclude_domains: list = None
) -> Union[Dict, str]:
    """
    Perform a web search using the Tavily API.

    This tool accesses real-time web data, news, articles and should be used when up-to-date information from the internet is required.
    """

    api_key = os.environ.get("TAVILY_API_KEY")
    if not api_key:
        raise ValueError("Missing TAVILY_API_KEY in environment variables.")

    payload = {
        "api_key": api_key,
        "query": query,
        "search_depth": search_depth,
        "topic": topic,
        "days": days if topic == "news" else None,
        "max_results": max_results,
        "include_images": include_images,
        "include_answer": include_answer,
        "include_raw_content": include_raw_content
    }

    if include_domains:
        payload["include_domains"] = include_domains
    if exclude_domains:
        payload["exclude_domains"] = exclude_domains

    try:
        response = requests.post(
            f"{TAVILY_BASE_URL}/search",
            json=payload,
            headers={'Content-Type': 'application/json'}
        )
        response.raise_for_status()  # Raises an HTTPError for bad responses
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}


if __name__ == "__main__":
    # Example usage of the tool
    search_web("Latest advancements in AI")