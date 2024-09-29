import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface InsiderTransactionData {
  ticker: string;
  [key: string]: string | number; // This allows for dynamic data
}

interface Props {
  insider_transactions: InsiderTransactionData[];
}

export const InsiderTransactionsTable: React.FC<Props> = ({ insider_transactions }) => {
  if (!insider_transactions || !insider_transactions || insider_transactions.length === 0) {
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

  // Format the filing_date to Mon Day, Year
  insider_transactions.forEach((row) => {
    row.filing_date = new Date(row.filing_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  });

  const headers = Object.keys(insider_transactions[0]);

  // Identify which columns are financial metrics (i.e., numbers)
  const financialMetrics = headers.filter(header =>
    typeof insider_transactions[0][header] === 'number' &&
    header !== 'ticker'
  );

  // Filter out the is_board_director column
  headers.splice(headers.indexOf('is_board_director'), 1);

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
        {insider_transactions.map((row, index) => (
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

export const InsiderTransactionsTableLoading: React.FC = () => {
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
