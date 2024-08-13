"use client";
import React from "react";
import { Chart } from "@/components/prebuilt/chart";
import { ChartHeader } from "@/components/prebuilt/chart-header";

export interface ChartData {
  ticker: string;
  prices: PriceData[];
}
export interface PriceData {
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  time: string;
  time_milliseconds: number;
}


export function ChartContainer(props: ChartData): React.JSX.Element {
  return (
    <div style={{minWidth: "750px"}}>
      <ChartHeader ticker={props.ticker} prices={props.prices}/>
      <Chart
        data={props.prices.map((price) => {
          return ({
            date: formatDate(price.time_milliseconds),
            value: price.close,
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