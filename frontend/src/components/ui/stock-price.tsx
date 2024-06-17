import React from "react";
import { Green, Pink } from "@/styles/colors";


interface LastTrade {
  p: number; // The bid price.
}

interface TickerData {
  ticker: string;               // The stock ticker.
  todaysChange: number;         // The dollar change of the stock price.
  todaysChangePerc: number;     // The percent change of the stock price.
  lastTrade: LastTrade;         // The last quote.
  updated: number;              // The time of the last quote in milliseconds since epoch.
}

interface StockPriceData {
  ticker: TickerData;
}

export function StockPrice({ stockPriceData }: { stockPriceData: StockPriceData }) {
  // Compute percent and dollar difference between end price and start price
  const tickerData = stockPriceData.ticker;
  const ticker = tickerData.ticker;
  const todaysChange = tickerData.todaysChange;
  const todaysChangePercent = tickerData.todaysChangePerc;
  const lastTrade = tickerData.lastTrade;

  return (
    <div>
      <div style={{ fontSize: "28px" }}>
        {ticker}
      </div>
      <div style={{ fontSize: "24px", fontWeight: "bold" }}>
        ${lastTrade.p.toFixed(2)}
      </div>
      <div style={{ fontSize: "12px", fontWeight: "bold", display: "flex" }}>
        <div style={{ marginRight: "8px" }}>
          {todaysChange > 0 ? (
            <span style={{ color: Green }}>+${todaysChange.toFixed(2)}</span>
          ) : (
            <span style={{ color: Pink }}>-${Math.abs(todaysChange).toFixed(2)}</span>
          )}
        </div>
        <div>
          {todaysChangePercent > 0 ? (
            <span style={{ color: Green }}>(+{todaysChangePercent.toFixed(2)}%)</span>
          ) : (
            <span style={{ color: Pink }}>({todaysChangePercent.toFixed(2)}%)</span>
          )}
        </div>
      </div>
    </div>
  );
}