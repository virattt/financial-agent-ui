import operator
from typing import Literal, TypedDict, Annotated, Sequence
from langchain_core.messages import BaseMessage, FunctionMessage
from langchain_openai.chat_models import ChatOpenAI
from langgraph.graph import END, StateGraph, MessagesState
from langgraph.graph.graph import CompiledGraph
from langgraph.prebuilt import ToolNode

from .tools.financials import get_financials
from .tools.last_quote import get_last_quote
from .tools.prices import get_prices
from .tools.ticker_news import get_ticker_news

tools = [get_last_quote, get_prices, get_financials, get_ticker_news]

model = ChatOpenAI(model="gpt-4", temperature=0).bind_tools(tools)


class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]


def should_continue(state: MessagesState) -> Literal["tools", "agent", END]:
    messages = state['messages']
    last_message = messages[-1]
    if last_message.tool_calls:
        return "tools"
    if isinstance(last_message, FunctionMessage):
        return "agent"
    return END


def call_model(state: MessagesState):
    messages = state['messages']
    response = model.invoke(messages)
    return {"messages": [response]}


def create_graph() -> CompiledGraph:
    tool_node = ToolNode(tools)

    workflow = StateGraph(AgentState)

    workflow.add_node("agent", call_model)
    workflow.add_node("tools", tool_node)

    workflow.set_entry_point("agent")

    workflow.add_conditional_edges(
        "agent",
        should_continue,
        {
            "tools": "tools",
            "agent": "agent",
            END: END,
        }
    )

    workflow.add_conditional_edges(
        "tools",
        should_continue,
        {
            "tools": "tools",
            "agent": "agent",
            END: END,
        }
    )

    graph = workflow.compile()

    return graph
