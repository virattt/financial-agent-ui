"use client";
import React from "react";
import { Chart } from "@/components/prebuilt/chart";
import { ChartHeader } from "@/components/prebuilt/chart-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

export function ChartLoading(): JSX.Element {
  return (
    <Card className="w-[450px]">
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>
            <Skeleton className="h-[18px] w-[48px]" />
          </CardTitle>
          <CardDescription>
            <div className="flex flex-col gap-[2px] pt-[4px]">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={`description-${i}`}
                  className="h-[12px] w-[86px]"
                />
              ))}
            </div>
          </CardDescription>
        </div>
        <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
          <Skeleton className="h-[38px]" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[12px]" />
      </CardContent>
    </Card>
  );
}