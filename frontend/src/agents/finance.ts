import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, BaseMessage, HumanMessage, SystemMessage, ToolMessage, } from "@langchain/core/messages";
import { Message } from "@/app/action";

import { ChatPromptTemplate, MessagesPlaceholder, } from "@langchain/core/prompts";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { tools } from "@/agents/tools";
import { systemPrompt } from "@/agents/system-prompt";

const llm = new ChatOpenAI({
  modelName: "gpt-4-turbo",
  temperature: 0.1,
});


const MEMORY_KEY = "chat_history";
const prompt = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  new MessagesPlaceholder(MEMORY_KEY),
  ["user", "{input}"],
  new MessagesPlaceholder("agent_scratchpad"),
]);

export async function runAgent(messages: BaseMessage[]) {
  const lastMessage = messages[messages.length - 1];

  const agent = await createOpenAIToolsAgent({
    llm,
    tools,
    prompt,
  });
  const agentExecutor = new AgentExecutor({
    agent,
    tools,
  }).withConfig({ runName: "Agent" });
  const eventStream = await agentExecutor.streamEvents(
    {
      input: lastMessage.content,
      chat_history: [...messages.slice(0, -1)],
    },
    { version: "v1" }
  );
  return eventStream;
}

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
