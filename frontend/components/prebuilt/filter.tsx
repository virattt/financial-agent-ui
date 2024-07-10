"use client";

import { startCase } from "lodash";

export interface FilterButtonProps {
  filterKey: string;
  filterValue: string | number;
}

export function FilterButton(props: FilterButtonProps): JSX.Element {
  return (
    <div className="p-2 min-w-[100px] rounded-md border-[0.5px] border-gray-400 flex flex-row items-start justify-center gap-[2px]">
      <p className="font-medium text-sm text-gray-700">
        {startCase(props.filterKey)}:
      </p>
      <p className="font-normal text-sm">{props.filterValue}</p>
    </div>
  );
}
