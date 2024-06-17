import React from "react";
import { Green, Pink } from "@/styles/colors";
import { StockData } from "@/components/ui/chart";

interface StockChartHeaderProps {
  stockData: StockData;
}
export const StockChartHeader: React.FC<StockChartHeaderProps> = ({
  stockData,
}) => {
  // Compute percent and dollar difference between end price and start price
  const prices = stockData.results;
  const startPrice = prices[0].c;
  const endPrice = prices[prices.length - 1].c;
  const percentDifference = ((endPrice - startPrice) / startPrice) * 100;
  const dollarDifference = endPrice - startPrice;

  return (
    <div>
      <div style={{ fontSize: "28px" }}>
        {stockData.ticker}
      </div>
      <div style={{ fontSize: "24px", fontWeight: "bold" }}>
        ${prices[prices.length - 1].c.toFixed(2)}
      </div>
      <div style={{ fontSize: "12px", fontWeight: "bold", display: "flex" }}>
        <div style={{ marginRight: "8px" }}>
          {dollarDifference > 0 ? (
            <span style={{ color: Green }}>+${dollarDifference.toFixed(2)}</span>
          ) : (
            <span style={{ color: Pink }}>-${Math.abs(dollarDifference).toFixed(2)}</span>
          )}
        </div>
        <div>
          {percentDifference > 0 ? (
            <span style={{ color: Green }}>(+{percentDifference.toFixed(2)}%)</span>
          ) : (
            <span style={{ color: Pink }}>({percentDifference.toFixed(2)}%)</span>
          )}
        </div>
      </div>
    </div>
  );
};