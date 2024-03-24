import { ChatOpenAI } from "@langchain/openai";
import type { ChatPromptTemplate } from "@langchain/core/prompts";
import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";
import { pull } from "langchain/hub";
import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { BaseMessage } from "@langchain/core/messages";
import {
  getFinancials,
  getNews,
  getLastQuote,
  getAggregates,
} from "@/lib/polygon";

const llm = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
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
    description: "Retrieves news articles for a given stock ticker.",
    schema: z.object({
      ticker: z.string().describe("The stock ticker symbol"),
    }),
    func: async ({ ticker }) => {
      const data = await getNews(ticker);
      return JSON.stringify(data);
    },
  }),
  new DynamicStructuredTool({
    name: "getLastQuote",
    description: "Retrieves the last quote for a given stock ticker.",
    schema: z.object({
      ticker: z.string().describe("The stock ticker symbol"),
    }),
    func: async ({ ticker }) => {
      const data = await getLastQuote(ticker);
      return JSON.stringify(data);
    },
  }),
  new DynamicStructuredTool({
    name: "getAggregates",
    description: "Retrieves aggregate data for a given stock ticker.",
    schema: z.object({
      ticker: z.string().describe("The stock ticker symbol"),
      limit: z.number().describe("The limit of results to retrieve"),
      type: z.string().describe("The type of aggregate data"),
      from: z.string().describe("The start date for the aggregate data"),
      to: z.string().describe("The end date for the aggregate data"),
    }),
    func: async ({ ticker, limit, type, from, to }) => {
      const data = await getAggregates(ticker, limit, type, from, to);
      return JSON.stringify(data);
    },
  }),
];

export async function runAgent(messages: BaseMessage[]) {
  const lastMessage = messages[messages.length - 1];
  const prompt = await pull<ChatPromptTemplate>(
    "hwchase17/openai-functions-agent"
  );
  const agent = await createOpenAIFunctionsAgent({
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
