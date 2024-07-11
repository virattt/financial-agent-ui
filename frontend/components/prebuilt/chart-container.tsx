"use client";
import React from "react";
import { Chart } from "@/components/prebuilt/chart";
import { ChartHeader } from "@/components/prebuilt/chart-header";
import { DemoGithubProps } from "@/components/prebuilt/github";

export interface ChartData {
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: PriceData[];
  count: number;
}

export interface PriceData {
  v: number;  // volume
  vw: number; // volume weighted average price
  o: number;  // open
  c: number;  // close
  h: number;  // high
  l: number;  // low
  t: number;  // timestamp
  n: number;  // number of trades
}


export function ChartContainer(props: ChartData): JSX.Element {
  return (
    <div style={{minWidth: "750px"}}>
      <ChartHeader ticker={props.ticker} prices={props.results}/>
      <Chart
        data={props.results.map((result) => {
          return ({
            date: formatDate(result.t),
            value: result.c,
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