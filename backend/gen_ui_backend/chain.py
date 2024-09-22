from datetime import datetime
from typing import List, Optional, TypedDict

from langchain.output_parsers.openai_tools import JsonOutputToolsParser
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnableConfig
from langchain_openai import ChatOpenAI
from langgraph.graph import END, StateGraph
from langgraph.graph.graph import CompiledGraph

from .tools.financials.search.tool import search_line_items
from .tools.last_quote import get_last_quote
from .tools.prices import get_prices
from .tools.ticker_news import get_ticker_news
from .tools.web_search.tavily.tool import search_web


class GenerativeUIState(TypedDict, total=False):
    input: HumanMessage
    result: Optional[str]
    """Plain text response if no tool was used."""
    tool_calls: Optional[List[dict]]
    """A list of parsed tool calls."""
    tool_result: Optional[dict]
    """The result of a tool call."""


system_prompt = f"""
You are a highly capable financial assistant named FinanceGPT. Your purpose is to provide insightful and concise analysis to help users make informed financial decisions.

When a user asks a question, follow these steps:
1. Identify the relevant financial data needed to answer the query.
2. Use the available tools to retrieve the necessary data, such as stock financials, news, or aggregate data.
3. Analyze the retrieved data and any generated charts to extract key insights and trends.
4. Formulate a concise response that directly addresses the user's question, focusing on the most important findings from your analysis.

Remember:
- Today's date is {datetime.today().strftime("%Y %m %d")}.
- Avoid simply regurgitating the raw data from the tools. Instead, provide a thoughtful interpretation and summary.
- If the query cannot be satisfactorily answered using the available tools, kindly inform the user and suggest alternative resources or information they may need.

Your ultimate goal is to empower users with clear, actionable insights to navigate the financial landscape effectively.

Remember your goal is to answer the users query and provide a clear, actionable answer.
"""


def invoke_model(state: GenerativeUIState, config: RunnableConfig) -> GenerativeUIState:
    tools_parser = JsonOutputToolsParser()
    initial_prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                system_prompt,
            ),
            MessagesPlaceholder("input"),
        ]
    )
    model = ChatOpenAI(model="gpt-4o", temperature=0, streaming=True)
    tools = [get_last_quote, get_prices, search_line_items, search_web]
    model_with_tools = model.bind_tools(tools)
    chain = initial_prompt | model_with_tools
    result = chain.invoke({"input": state["input"]}, config)

    if not isinstance(result, AIMessage):
        raise ValueError("Invalid result from model. Expected AIMessage.")

    if isinstance(result.tool_calls, list) and len(result.tool_calls) > 0:
        parsed_tools = tools_parser.invoke(result, config)
        return {"tool_calls": parsed_tools}
    else:
        return {"result": str(result.content)}


def invoke_tools_or_return(state: GenerativeUIState) -> str:
    if "result" in state and isinstance(state["result"], str):
        return END
    elif "tool_calls" in state and isinstance(state["tool_calls"], list):
        return "invoke_tools"
    else:
        raise ValueError("Invalid state. No result or tool calls found.")


def invoke_tools(state: GenerativeUIState) -> GenerativeUIState:
    tools_map = {
        "get-last-quote": get_last_quote,
        "get-prices": get_prices,
        "search-line-items": search_line_items,
        "search-web": search_web,
    }

    if state["tool_calls"] is not None:
        tool = state["tool_calls"][0]
        selected_tool = tools_map[tool["type"]]
        return {"tool_result": selected_tool.invoke(tool["args"])}
    else:
        raise ValueError("No tool calls found in state.")


def create_graph() -> CompiledGraph:
    workflow = StateGraph(GenerativeUIState)

    workflow.add_node("invoke_model", invoke_model)  # type: ignore
    workflow.add_node("invoke_tools", invoke_tools)
    workflow.add_conditional_edges("invoke_model", invoke_tools_or_return)
    workflow.set_entry_point("invoke_model")
    workflow.set_finish_point("invoke_tools")

    graph = workflow.compile()
    return graph
