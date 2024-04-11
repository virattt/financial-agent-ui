import React from "react";
import { format, parseISO } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis
} from "recharts";
import { DarkCharcoal, Gray } from "@/styles/colors";

type Props = {
  color: string;
  data: StockResult[];
};

interface StockResult {
  close: number;
  date: string;
  date_label?: string;
}

export const StockChart: React.FC<Props> = ({ color, data }) => {
  if (data.length === 0) {
    return <div/>;
  }

  const startPrice = data[0].close;
  const endPrice = data[data.length - 1].close;
  const maxPrice = Math.max(startPrice, endPrice, startPrice);
  const minPrice = Math.min(startPrice, endPrice, startPrice);

  // Add additional empty data / price objects, if needed
  const clonedData = data.map(a => {
    return { ...a }
  })
  // addPaddingToTimeSeries(clonedData, timeRange)

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart className="ml-n2" data={clonedData}>
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.20}/>
            <stop offset="30%" stopColor={color} stopOpacity={0.05}/>
            <stop offset="70%" stopColor={color} stopOpacity={0.00}/>
          </linearGradient>
        </defs>

        <Area dataKey="close" stroke={color} strokeWidth={2.5} fill="url(#chartGradient)"/>

        <XAxis
          dataKey='date_label'
          axisLine={false}
          tickLine={false}
          tickFormatter={str => {
            if (str === "09:30 AM" || str === "12 PM" || str === "3 PM") {
              return str;
            }
            const date = parseISO(str);
            if (date.getDate() % 7 === 0) {
              return format(date, "MMM, d");
            }
            return "";
          }}
        />

        <YAxis
          dataKey="close"
          width={20}
          axisLine={false}
          tickLine={false}
          tick={false}
          domain={[minPrice - getDomainBuffer(minPrice), maxPrice + getDomainBuffer(maxPrice)]}
        />

        <ReferenceLine y={startPrice} stroke={Gray} strokeDasharray="1 3"/>
        <Tooltip content={<CustomTooltip/>}/>

        <CartesianGrid opacity={0.1} vertical={false}/>

      </AreaChart>
    </ResponsiveContainer>
  );
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="stock-tooltip">
        <div className="row mx-1">
          <span className="label" color={DarkCharcoal} style={{ fontWeight: "bold" }}>${`${payload[0].value}`}</span>
          <span className="ml-2" color={Gray}>{`${payload[0].payload.date}`}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const getDomainBuffer = (maxPrice: number) => {
  if (maxPrice >= 100000) {
    return 1000;
  }
  if (maxPrice >= 100000) {
    return 10;
  }

  if (maxPrice >= 1000) {
    return 1
  }
  return .1;
};
