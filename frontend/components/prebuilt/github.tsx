"use client";

import { CircleIcon, StarIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";
import { format } from "date-fns";

export interface DemoGithubProps {
  owner: string;
  repo: string;
  description: string;
  stars: number;
  language: string;
}

export function GithubLoading(): JSX.Element {
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

export function Github(props: DemoGithubProps): JSX.Element {
  const currentMonth = format(new Date(), "MMMM");
  const currentYear = format(new Date(), "yyyy");
  return (
    <Card className="w-[450px]">
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle>
            {props.owner}/{props.repo}
          </CardTitle>
          <CardDescription>{props.description}</CardDescription>
        </div>
        <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
          <Button
            onClick={() => {
              window.location.href = `https://github.com/${props.owner}/${props.repo}`;
            }}
            variant="secondary"
            className="px-3 shadow-none"
          >
            <StarIcon className="mr-2 h-4 w-4" />
            Star
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CircleIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
            {props.language}
          </div>
          <div className="flex items-center">
            <StarIcon className="mr-1 h-3 w-3" />
            {props.stars.toLocaleString()}
          </div>
          <div>
            Updated {currentMonth} {currentYear}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
