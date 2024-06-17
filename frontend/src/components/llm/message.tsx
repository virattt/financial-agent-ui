"use client";

import { cn } from "@/lib/utils";

import { CodeBlock } from "../ui/codeblock";
import { MemoizedReactMarkdown } from "../markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { StreamableValue } from "ai/rsc";
import { useStreamableText } from "@/hooks/use-streamable-text";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Bot, BotIcon, UserIcon } from "lucide-react";
import { spinner } from "@/components/ui/spinner";

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div
        className="flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm">
        <UserIcon className="size-4"/>
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2">
        {children}
      </div>
    </div>
  );
}

export function BotMessage({
  content,
  className,
}: {
  content: string | StreamableValue<string>;
  className?: string;
}) {
  const text = useStreamableText(content);

  return (
    <div className={cn("group relative flex items-start md:-ml-12", className)}>
      <div
        className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <BotIcon className="size-4"/>
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <MemoizedReactMarkdown
          className="prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose dark:prose-invert prose-p:leading-normal prose-pre:p-0 prose-ol:leading-normal prose-ul:leading-normal prose-li:my-1 max-w-full break-words text-base "
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            table({ children }) {
              return <Table>{children}</Table>;
            },
            thead({ children }) {
              return <TableHeader>{children}</TableHeader>;
            },
            tbody({ children }) {
              return <TableBody>{children}</TableBody>;
            },
            tr({ children }) {
              return <TableRow>{children}</TableRow>;
            },
            th({ children }) {
              return <TableHead className="py-2">{children}</TableHead>;
            },
            td({ children }) {
              return <TableCell className="py-2">{children}</TableCell>;
            },
            p({ children }) {
              return <p>{children}</p>;
            },
            a({ children, href, ...props }) {
              const childrenArray = React.Children.toArray(children);
              const childrenText = childrenArray
                .map((child) => child?.toString() ?? "")
                .join("");

              const cleanedText = childrenText.replace(/\[|\]/g, "");
              const isNumber = /^\d+$/.test(cleanedText);

              return isNumber ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  {...props}
                  className="bg-green-3 hover:bg-green-8 hover:text-primary-foreground relative bottom-[6px] mx-0.5 rounded px-[5px] py-[2.5px] text-[8px] font-bold no-underline"
                >
                  {children}
                </a>
              ) : (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  {...props}
                  className="hover:underline"
                >
                  {children}
                </a>
              );
            },
            ol({ children }) {
              return <ol className="list-decimal pl-6">{children}</ol>;
            },
            ul({ children }) {
              return (
                <ul className="marker:text-muted-extra my-1 list-disc pl-6">
                  {children}
                </ul>
              );
            },
            li({ children }) {
              return <li>{children}</li>;
            },

            // @ts-ignore
            code({ node, inline, className, children, ...props }) {
              const childArray = React.Children.toArray(children);
              const firstChild = childArray[0] as React.ReactElement;
              const firstChildAsString = React.isValidElement(firstChild)
                ? (firstChild as React.ReactElement).props.children
                : firstChild;

              if (firstChildAsString === "▍") {
                return (
                  <span className="mt-1 animate-pulse cursor-default">▍</span>
                );
              }

              if (typeof firstChildAsString === "string") {
                childArray[0] = firstChildAsString.replace("`▍`", "▍");
              }

              const match = /language-(\w+)/.exec(className || "");

              if (
                typeof firstChildAsString === "string" &&
                !firstChildAsString.includes("\n")
              ) {
                return (
                  <code className={className} {...props}>
                    {childArray}
                  </code>
                );
              }
              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ""}
                  value={String(children).replace(/\n$/, "")}
                  {...props}
                />
              );
            },
          }}
        >
          {text}
        </MemoizedReactMarkdown>
      </div>
    </div>
  );
}

export function BotCard({
  children,
  showAvatar = true,
}: {
  children: React.ReactNode;
  showAvatar?: boolean;
}) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div
        className={cn(
          "flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm",
          !showAvatar && "invisible"
        )}
      >
        <Bot/>
      </div>
      <div className="ml-4 flex-1 pl-2">{children}</div>
    </div>
  );
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        "mt-2 flex items-center justify-center gap-2 text-xs text-gray-500"
      }
    >
      <div className={"max-w-[600px] flex-initial p-2"}>{children}</div>
    </div>
  );
}

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div
        className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <Bot/>
      </div>
      <div className="ml-4 h-[24px] flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1">
        {spinner}
      </div>
    </div>
  );
}
