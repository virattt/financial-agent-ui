import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getAggregates, getFinancials, getNews, getTickerSnapshot } from "@/lib/polygon";

export const tools = [
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
    description: "Retrieves news articles for a given stock ticker. Use this information to answer concisely",
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
    description: "Retrieves historical stock price data for a given stock ticker over a specified time period.",
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

  new DynamicStructuredTool({
    name: "getLatestPrice",
    description: "Retrieves the latest price for a given stock ticker.",
    schema: z.object({
      ticker: z.string().describe("The stock ticker symbol"),
    }),
    func: async ({ ticker}) => {
      const data = await getTickerSnapshot(ticker);
      return JSON.stringify(data);
    },
  }),
];