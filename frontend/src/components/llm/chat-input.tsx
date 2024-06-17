"use client";
import { AI } from "@/app/action";
import { UserMessage } from "@/components/llm/message";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEnterSubmit } from "@/hooks/use-enter-submit";
import { nanoid } from "ai";
import { useActions, useAIState, useUIState } from "ai/rsc";
import { CornerDownLeft } from "lucide-react";
import * as React from "react";

export interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
}

export function ChatInput({ input, setInput }: ChatInputProps) {
  const [aiState] = useAIState();
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const { formRef, onKeyDown } = useEnterSubmit();

  return (
    <div className="fixed inset-x-0 bottom-12 w-full from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <div className="mx-auto sm:max-w-3xl sm:px-4">
        <div className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
          <form
            ref={formRef}
            onSubmit={async (e: any) => {
              e.preventDefault();
              // Blur focus on mobile
              if (window.innerWidth < 600) {
                e.target["message"]?.blur();
              }
              const value = input.trim();
              setInput("");
              if (!value) return;
              // Optimistically add user message UI
              setMessages((currentMessages) => [
                ...currentMessages,
                {
                  id: nanoid(),
                  display: <UserMessage>{value}</UserMessage>,
                },
              ]);
              // Submit and get response message
              const responseMessage = await submitUserMessage(value);
              setMessages((currentMessages) => [
                ...currentMessages,
                responseMessage,
              ]);
            }}
          >
            <Label htmlFor="message" className="sr-only">
              Message
            </Label>
            <div className="flex items-center">
              <Textarea
                ref={inputRef}
                tabIndex={0}
                onKeyDown={onKeyDown}
                placeholder="Send a message."
                className="flex-grow min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                autoFocus
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                name="message"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button type="submit" size="sm" className="mx-2 gap-1.5">
                Send
                <CornerDownLeft className="size-3.5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}