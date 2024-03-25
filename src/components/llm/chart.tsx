"use client";
import { AreaChart } from "@tremor/react";

import { IgrFinancialChart } from "igniteui-react-charts";
import { IgrFinancialChartModule } from "igniteui-react-charts";
import { Card } from "@/components/ui/card";

import React from "react";
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

export function StockChart({ stockData }: { stockData: StockData }) {
  const data = stockData.results.map((result) => ({
    date: new Date(result.t).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
    }),
    Open: result.o,
  }));
  const dataFormatter = (number: number) =>
    `$${Intl.NumberFormat("us").format(number).toString()}`;
  return (
    <AreaChart
      className="h-80"
      data={data}
      index="date"
      categories={["Open"]}
      colors={["rose"]}
      valueFormatter={dataFormatter}
      yAxisWidth={60}
      onValueChange={(v) => console.log(v)}
    />
  );
}
