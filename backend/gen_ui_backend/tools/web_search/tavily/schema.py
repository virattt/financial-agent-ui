from langchain.pydantic_v1 import BaseModel, Field
from typing import List, Optional


class TavilySearchInput(BaseModel):
    query: str = Field(..., description="The search query you want to execute with Tavily.")
    search_depth: Optional[str] = Field(
        default="basic",
        description="The depth of the search. It can be 'basic' or 'advanced'."
    )
    topic: Optional[str] = Field(
        default="general",
        description="The category of the search. Currently supports 'general' and 'news'."
    )
    days: Optional[int] = Field(
        default=3,
        description="The number of days back from the current date to include in the search results. Only available for 'news' topic."
    )
    max_results: Optional[int] = Field(
        default=5,
        description="The maximum number of search results to return."
    )
    include_images: Optional[bool] = Field(
        default=False,
        description="Include a list of query-related images in the response."
    )
    include_image_descriptions: Optional[bool] = Field(
        default=False,
        description="When include_images is True, adds descriptive text for each image."
    )
    include_answer: Optional[bool] = Field(
        default=False,
        description="Include a short answer to original query."
    )
    include_raw_content: Optional[bool] = Field(
        default=False,
        description="Include the cleaned and parsed HTML content of each search result."
    )
    include_domains: Optional[List[str]] = Field(
        default=[],
        description="A list of domains to specifically include in the search results."
    )
    exclude_domains: Optional[List[str]] = Field(
        default=[],
        description="A list of domains to specifically exclude from the search results."
    )

    class Config:
        schema_extra = {
            "example": {
                "query": "Latest advancements in AI",
                "api_key": "your-api-key-here",
                "search_depth": "advanced",
                "topic": "news",
                "days": 7,
                "max_results": 10,
                "include_images": True,
                "include_image_descriptions": True,
                "include_answer": True,
                "include_raw_content": False,
                "include_domains": ["techcrunch.com", "wired.com"],
                "exclude_domains": ["example.com"]
            }
        }
