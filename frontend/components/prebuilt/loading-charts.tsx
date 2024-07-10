import { Skeleton } from "@/components/ui/skeleton";

export function LoadingPieChart(): JSX.Element {
  return (
    <div className="flex flex-col gap-2 items-center justify-center border-l-[0.5px] border-b-[0.5px] border-gray-300 rounded-md p-2">
      <Skeleton className="h-full w-full rounded-full" />
    </div>
  );
}

export function LoadingBarChart(): JSX.Element {
  return (
    <div className="flex flex-col gap-2 items-start justify-end border-l-[0.5px] border-b-[0.5px] border-gray-300 rounded-md p-2">
      <Skeleton className="h-16 w-[85%]" />
      <Skeleton className="h-16 w-[60%]" />
      <Skeleton className="h-16 w-[90%]" />
      <Skeleton className="h-16 w-[45%]" />
      <Skeleton className="h-16 w-[25%]" />
    </div>
  );
}

export function LoadingLineChart(): JSX.Element {
  return (
    <div className="flex flex-col gap-2 items-start justify-end border-l-[0.5px] border-b-[0.5px] border-gray-300 rounded-md p-2 h-[600px]">
      <Skeleton className="h-4 w-3/4 rounded-full mb-2" />
      <Skeleton className="h-3 w-2/3 rounded-full mb-2" />
      <Skeleton className="h-5 w-5/6 rounded-full mb-2" />
      <Skeleton className="h-4 w-3/4 rounded-full mb-2" />
      <Skeleton className="h-4 w-3/4 rounded-full mb-2" />
      <Skeleton className="h-3 w-2/3 rounded-full mb-2" />
      <Skeleton className="h-5 w-5/6 rounded-full mb-2" />
      <Skeleton className="h-4 w-3/4 rounded-full mb-2" />
      <Skeleton className="h-4 w-3/4 rounded-full mb-2" />
      <Skeleton className="h-3 w-2/3 rounded-full mb-2" />
      <Skeleton className="h-5 w-5/6 rounded-full mb-2" />
      <Skeleton className="h-4 w-3/4 rounded-full mb-2" />
      <Skeleton className="h-4 w-3/4 rounded-full mb-2" />
      <Skeleton className="h-3 w-2/3 rounded-full mb-2" />
      <Skeleton className="h-5 w-5/6 rounded-full mb-2" />
      <Skeleton className="h-4 w-3/4 rounded-full mb-2" />
      <Skeleton className="h-3 w-1/2 rounded-full" />
    </div>
  );
}
