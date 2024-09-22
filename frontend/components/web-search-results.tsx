import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface SearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

interface Props {
  results: SearchResult[];
}

export const WebSearchResults: React.FC<Props> = ({ results }) => {
  if (!results || results.length === 0) {
    return <p className="text-gray-500">No search results available.</p>;
  }

  return (
    <div className="space-y-6">
      {results.map((result, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-blue-600 hover:underline">
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              {result.title}
            </a>
          </h3>
          <p className="text-sm text-gray-500 mb-2">{result.url}</p>
          <p className="text-sm text-gray-700">{result.content}</p>
          <p className="text-xs text-gray-400 mt-2">Relevance score: {result.score.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};

export const WebSearchResultsLoading: React.FC = () => {
  return (
    <div className="w-full">
      <div className="w-1/2 space-y-4">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="p-4">
            <Skeleton className="h-[20px] w-[500px] mb-2" />
            <Skeleton className="h-[20px] w-[500px] mb-2" />
            <Skeleton className="h-[50px] w-[500px]" />
          </div>
        ))}
      </div>
    </div>
  );
};