"use client";
import React from "react";
import { StockChart } from "@/components/ui/stock-chart";
import { StockChartHeader } from "@/components/ui/stock-chart-header";

export interface StockData {
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: StockResult[];
  count: number;
}

interface StockResult {
  v: number;
  vw: number;
  o: number;
  c: number;
  h: number;
  l: number;
  t: number;
  n: number;
}

export function Chart({ stockData }: { stockData: StockData }) {
  return (
    <div>
      <StockChartHeader stockData={stockData}/>
      <StockChart
        data={stockData.results.map((result) => {
          return ({
            date: formatDate(result.t),
            close: result.c,
          });
        })}
      />
    </div>
  );
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
}