"use client";

import React, { useState } from "react";
import { useAIState, useUIState } from "ai/rsc";
import { MessageList } from "@/components/llm/message-list";
import { cn } from "@/lib/utils";
import { ChatInput } from "@/components/llm/chat-input";
import { Card, CardContent, CardHeader, } from "@/components/ui/card";

export function Chat() {
  const [messages] = useUIState();
  const [input, setInput] = useState("");
  const [aiState] = useAIState();

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
      {messages.length === 0 ? (
        <IntroSection setInput={setInput}/>
      ) : (
        <div className={cn("pb-[200px] pt-4 md:pt-10")}>
          <MessageList messages={messages}/>
        </div>
      )}

      <ChatInput input={input} setInput={setInput}/>
    </div>
  );
}

function IntroSection({ setInput }: { setInput: (input: string) => void }) {
  const examples = [
    "Compare the stock price of AAPL, NVDA and MSFT for the last 30 days, the news, and give a detailed analysis and what looks the most bullish",
    "What are the key factors driving the recent stock price movements of Tesla (TSLA)? Provide a brief analysis.",
  ];

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="sm:mx-0 max-w-screen-md rounded-md border sm:w-full">
        <CardHeader>
          <div className="flex flex-col space-y-4">
            <div className="text-lg font-semibold text-black">
              Finance Agent
            </div>
            <div>
              Open source finance agent + generative UI using Openai, Langchain
              and Vercel AI
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4  ">
            {examples.map((example, i) => (
              <button
                key={i}
                className="rounded-md border border-gray-200 bg-white px-5 py-3 text-left text-sm text-gray-500 transition-all duration-75 hover:border-black hover:text-gray-700 active:bg-gray-50"
                onClick={() => {
                  setInput(example);
                }}
              >
                {example}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
