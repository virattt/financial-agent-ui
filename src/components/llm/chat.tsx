"use client";

import React, { useState } from "react";
import { useUIState, useActions, useAIState } from "ai/rsc";
import { AI } from "@/app/action";
import { useScrollAnchor } from "@/hooks/use-scroll-anchor";
import { MessageList } from "@/components/llm/message-list";
import { cn } from "@/lib/utils";
import { ChatInput } from "@/components/llm/chat-input";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Chat() {
  const [messages] = useUIState();
  const [input, setInput] = useState("");
  const [aiState] = useAIState();
  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();
  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      ref={scrollRef}
    >
      <div className={cn("pb-[200px] pt-4 md:pt-10")} ref={messagesRef}>
        <MessageList messages={messages} />
        <div className="h-px w-full" ref={visibilityRef} />
      </div>
      <ChatInput
        input={input}
        setInput={setInput}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />
    </div>
  );
}
