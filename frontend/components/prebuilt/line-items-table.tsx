import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface LineItemsData {
  ticker: string;
  report_period: string;
  period: string;

  [key: string]: string | number; // This allows for dynamic financial metrics
}

interface Props {
  search_results: LineItemsData[];
}

export const LineItemsTable: React.FC<Props> = ({ search_results }) => {
  if (!search_results || !search_results || search_results.length === 0) {
    return <p className="text-gray-500">No data available.</p>;
  }

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Format the report_period to Mon Day, Year
  search_results.forEach((row) => {
    row.report_period = new Date(row.report_period).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  });

  const headers = Object.keys(search_results[0]);

  // Identify which columns are financial metrics (i.e., numbers)
  const financialMetrics = headers.filter(header =>
    typeof search_results[0][header] === 'number' &&
    header !== 'ticker' &&
    header !== 'report_period' &&
    header !== 'period'
  );


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
        <tr>
          {headers.map((header) => (
            <th key={header} className="px-6 py-3 text-left text-xs text-white bg-[#0A0C10] uppercase tracking-wider">
              {header.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())}
            </th>
          ))}
        </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
        {search_results.map((row, index) => (
          <tr key={index}>
            {headers.map((header) => (
              <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                {financialMetrics.includes(header)
                  ? formatNumber(row[header] as number)
                  : row[header]}
              </td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export const LineItemsTableLoading: React.FC = () => {
  // Assume we're loading data for 3 rows and 5 columns
  const rowCount = 3;
  const columnCount = 5;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
        <tr>
          {Array(columnCount).fill(0).map((_, index) => (
            <th key={index} className="px-6 py-3 text-left">
              <Skeleton className="h-4 w-20"/>
            </th>
          ))}
        </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
        {Array(rowCount).fill(0).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array(columnCount).fill(0).map((_, colIndex) => (
              <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                <Skeleton className="h-4 w-24"/>
              </td>
            ))}
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};
