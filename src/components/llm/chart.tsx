"use client";
import React from "react";
import { StockChart } from "@/components/llm/StockChart";
import { Green } from "@/styles/colors";

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
    <StockChart
      color={Green}
      data={stockData.results.map((result) => {
        return ({
          date: formatDate(result.t),
          close: result.c,
        });
      })}
    />
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