import { ChatOpenAI } from "@langchain/openai";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import {
  SystemMessage,
  AIMessage,
  HumanMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { Message } from "@/app/action";

const chatModel = new ChatOpenAI({});
const outputParser = new BytesOutputParser();

export const chain = RunnableSequence.from([
  new ChatOpenAI({ temperature: 0 }),
  new BytesOutputParser(),
]);

// converts to langchain messages: system, ai, human, tool
export const convertMessages = (messages: Message[]) => {
  return messages.map((message) => {
    switch (message.role) {
      case "system":
        return new SystemMessage(message.content);
      case "user":
        return new HumanMessage(message.content);
      case "assistant":
        return new AIMessage(message.content);
      case "tool":
        const toolMessageWithContent = new ToolMessage({
          tool_call_id: message.id,
          content: message.content,
          additional_kwargs: {
            tool_calls: message.toolCalls,
          },
        });
        return new ToolMessage(toolMessageWithContent);
      default:
        throw new Error(`Unsupported message role: ${message.role}`);
    }
  });
};
