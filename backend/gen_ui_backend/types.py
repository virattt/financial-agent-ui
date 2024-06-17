from typing import List, Union

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.pydantic_v1 import BaseModel


class ChatInputType(BaseModel):
    input: List[Union[HumanMessage, AIMessage, SystemMessage]]
