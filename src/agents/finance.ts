import { ChatOpenAI } from "@langchain/openai";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import {
  SystemMessage,
  AIMessage,
  HumanMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { Message } from "@/app/action";

import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { BaseMessage } from "@langchain/core/messages";
import { getFinancials, getNews, getAggregates } from "@/lib/polygon";

const llm = new ChatOpenAI({
  modelName: "gpt-4-turbo-preview",
  temperature: 0.1,
});

const tools = [
  new DynamicStructuredTool({
    name: "getFinancials",
    description: "Retrieves financial data for a given stock ticker.",
    schema: z.object({
      ticker: z.string().describe("The stock ticker symbol"),
    }),
    func: async ({ ticker }) => {
      const data = await getFinancials(ticker);
      return JSON.stringify(data);
    },
  }),
  new DynamicStructuredTool({
    name: "getNews",
    description:
      "Retrieves news articles for a given stock ticker. Use this information to answer concisely",
    schema: z.object({
      ticker: z.string().describe("The stock ticker symbol"),
    }),
    func: async ({ ticker }) => {
      const data = await getNews(ticker);
      return JSON.stringify(data);
    },
  }),

  new DynamicStructuredTool({
    name: "getStockPriceHistory",
    description:
      "Retrieves historical stock price data for a given stock ticker over a specified time period.",
    schema: z.object({
      ticker: z.string().describe("The stock ticker symbol"),
      from: z.string().describe("The start date for the stock price data"),
      to: z.string().describe("The end date for the stock price data"),
    }),
    func: async ({ ticker, from, to }) => {
      const data = await getAggregates(ticker, from, to);
      return JSON.stringify(data);
    },
  }),
];
const systemPrompt = `
You are a highly capable financial assistant named FinanceGPT. Your purpose is to provide insightful and concise analysis to help users make informed financial decisions.

When a user asks a question, follow these steps:
1. Identify the relevant financial data needed to answer the query.
2. Use the available tools to retrieve the necessary data, such as stock financials, news, or aggregate data.
3. Analyze the retrieved data and any generated charts to extract key insights and trends.
4. Formulate a concise response that directly addresses the user's question, focusing on the most important findings from your analysis.

Remember:
- Today's date is ${new Date().toLocaleDateString()}.
- Avoid simply regurgitating the raw data from the tools. Instead, provide a thoughtful interpretation and summary.
- If the query cannot be satisfactorily answered using the available tools, kindly inform the user and suggest alternative resources or information they may need.

Your ultimate goal is to empower users with clear, actionable insights to navigate the financial landscape effectively.

Remember your goal is to answer the users query and provide a clear, actionable answer.
`;

const MEMORY_KEY = "chat_history";
const prompt = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  new MessagesPlaceholder(MEMORY_KEY),
  ["user", "{input}"],
  new MessagesPlaceholder("agent_scratchpad"),
]);
export async function runAgent(messages: BaseMessage[]) {
  const lastMessage = messages[messages.length - 1];

  const agent = await createOpenAIToolsAgent({
    llm,
    tools,
    prompt,
  });
  const agentExecutor = new AgentExecutor({
    agent,
    tools,
  }).withConfig({ runName: "Agent" });
  const eventStream = await agentExecutor.streamEvents(
    {
      input: lastMessage.content,
      chat_history: [...messages.slice(0, -1)],
    },
    { version: "v1" }
  );
  return eventStream;
}

const chatModel = new ChatOpenAI({});
const outputParser = new BytesOutputParser();

export const chain = RunnableSequence.from([
  new ChatOpenAI({ temperature: 0 }),
  new BytesOutputParser(),
]);

// converts to langchain messages: system, ai, human, tool
export const convertMessages = (messages: Message[]) => {
  return messages.map((message) => {
    switch (message.role) {
      case "system":
        return new SystemMessage(message.content);
      case "user":
        return new HumanMessage(message.content);
      case "assistant":
        return new AIMessage(message.content);
      case "tool":
        const toolMessageWithContent = new ToolMessage({
          tool_call_id: message.id,
          content: message.content,
          additional_kwargs: {
            tool_calls: message.toolCalls,
          },
        });
        return new ToolMessage(toolMessageWithContent);
      default:
        throw new Error(`Unsupported message role: ${message.role}`);
    }
  });
};
