from typing import Optional

from langchain.pydantic_v1 import BaseModel, Field


class InsiderTransactionsInput(BaseModel):
    ticker: str = Field(..., description="The ticker that you want to fetch insider transactions for.")
    limit: Optional[int] = Field(100, description="The maximum number of insider transactions to return.")

    class Config:
        schema_extra = {
            "example": {
                "ticker": "NVDA",
                "limit": 100
            }
        }
