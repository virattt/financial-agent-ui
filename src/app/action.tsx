//@ts-ignore
import { OpenAI } from "openai";
import {
  createAI,
  createStreamableUI,
  createStreamableValue,
  getMutableAIState,
  readStreamableValue,
  render,
} from "ai/rsc";
import { z } from "zod";
import { nanoid } from "ai";
import { BotCard, BotMessage, SpinnerMessage } from "@/components/llm/message";
import { sleep } from "openai/core.mjs";
import { chain, convertMessages, runAgent } from "@/agents/finance";
import {
  FunctionToolCall,
  ToolCall,
} from "openai/resources/beta/threads/runs/steps.mjs";

import { NewsCarousel } from "@/components/llm/news";
import { StockChart } from "@/components/llm/chart";
import FunctionCallBadge from "@/components/llm/fcall";
import { Financials } from "@/components/llm/financials";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function submitUserMessage(content: string) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: "user",
        content,
      },
    ],
  });
  let textStream: ReturnType<typeof createStreamableValue<string>> | undefined;
  let textNode: React.ReactNode | undefined;
  let toolNode: React.ReactNode | undefined;
  const ui = createStreamableUI();
  let assistantMessage = "";
  async function handleEvent(event: any) {
    const eventType = event.event;

    if (eventType === "on_llm_start" || eventType === "on_llm_stream") {
      const content = event.data?.chunk?.message?.content;
      if (content !== undefined && content !== "") {
        if (!textStream) {
          textStream = createStreamableValue("");
          textNode = <BotMessage content={textStream.value} />;
          ui.append(textNode);
        }
        textStream.update(content);
      }
    } else if (eventType === "on_llm_end") {
      if (textStream) {
        textStream.done();
        assistantMessage += event.data.output;
        textStream = undefined;
      }
    } else if (eventType === "on_tool_start") {
      toolNode = (
        <FunctionCallBadge name={event.name} args={event.data.input} />
      );
      assistantMessage += event.data.output;
      ui.append(toolNode);
    } else if (eventType === "on_tool_end") {
      assistantMessage += event.data.output;
      const parsedOutput = JSON.parse(event.data.output);
      if (event.name === "getNews" && parsedOutput) {
        toolNode = <NewsCarousel articles={parsedOutput} />;
      } else if (event.name === "getStockPriceHistory") {
        toolNode = <StockChart stockData={parsedOutput} />;
      } else {
        toolNode = <Financials data={parsedOutput} />;
      }
      ui.append(toolNode);
    }
  }

  async function processEvents() {
    const eventStream = await runAgent(convertMessages(aiState.get().messages));

    for await (const event of eventStream) {
      await handleEvent(event);
    }

    ui.done();

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: "assistant",
          content: assistantMessage,
        },
      ],
    });
  }

  processEvents();

  return {
    id: nanoid(),
    display: ui?.value,
  };
}

export type Message = {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  toolCalls?: FunctionToolCall[];
  id: string;
  name?: string;
};
export type AIState = {
  chatId: string;
  messages: Message[];
};

export type UIState = {
  id: string;
  display: React.ReactNode;
}[];

// The initial UI state that the client will keep track of, which contains the message IDs and their UI nodes.
const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

// AI is a provider you wrap your application with so you can access AI and UI state in your components.
export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
  },
  // Each state can be any shape of object, but for chat applications
  // it makes sense to have an array of messages. Or you may prefer something like { id: number, messages: Message[] }
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
});
