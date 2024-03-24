"use server";
import { restClient } from "@polygon.io/client-js";
const rest = restClient(process.env.POLY_API_KEY);
import axios, { AxiosResponse } from "axios";

const POLYGON_BASE_URL = "https://api.polygon.io/";

async function getFinancials(ticker: string): Promise<any> {
  const url = `${POLYGON_BASE_URL}vX/reference/financials?ticker=${ticker}&apiKey=${process.env.POLY_API_KEY}`;
  const response: AxiosResponse = await axios.get(url);
  const data = response.data;

  const status = data.status;
  if (status !== "OK") {
    throw new Error(`API Error: ${JSON.stringify(data)}`);
  }

  return data.results;
}
async function getNews(ticker: string) {
  try {
    const data = await rest.reference.tickerNews({ ticker: ticker });
    console.log("Last quote data:", data);
    return data;
  } catch (e) {
    console.error("An error occurred while fetching the last quote:", e);
    throw e;
  }
}
async function getLastQuote(ticker: string) {
  try {
    const data = await rest.stocks.lastQuote(ticker);
    console.log("Last quote data:", data);
    return data;
  } catch (e) {
    console.error("An error occurred while fetching the last quote:", e);
    throw e;
  }
}

async function getAggregates(
  ticker: string,
  limit: number,
  type: string,
  from: string,
  to: string
) {
  try {
    const data = await rest.stocks.aggregates(ticker, limit, type, from, to);
    console.log("Last quote data:", data);
    return data;
  } catch (e) {
    console.error("An error occurred while fetching the last quote:", e);
    throw e;
  }
}

export { getFinancials, getNews, getLastQuote, getAggregates };
