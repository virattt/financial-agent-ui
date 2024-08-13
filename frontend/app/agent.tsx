import { RemoteRunnable } from "@langchain/core/runnables/remote";
import { EventHandlerFields, exposeEndpoints, streamRunnableUI } from "@/utils/server";
import "server-only";
import { StreamEvent } from "@langchain/core/tracers/log_stream";
import { GithubLoading } from "@/components/prebuilt/github";
import { createStreamableUI, createStreamableValue } from "ai/rsc";
import { AIMessage } from "@/ai/message";
import { ChartContainer } from "@/components/prebuilt/chart-container";
import React from "react";

const API_URL = "http://localhost:8000/chat";

type ToolComponent = {
  loading: (props?: any) => React.JSX.Element;
  final: (props?: any) => React.JSX.Element;
};

type ToolComponentMap = {
  [tool: string]: ToolComponent;
};

const TOOL_COMPONENT_MAP: ToolComponentMap = {
  "get-prices": {
    loading: (props?: any) => <GithubLoading {...props} />,
    final: (props?: any) => <ChartContainer {...props} />,
  },
  // "invoice-parser": {
  //   loading: (props?: any) => <InvoiceLoading {...props} />,
  //   final: (props?: any) => <Invoice {...props} />,
  // },
  // "weather-data": {
  //   loading: (props?: any) => <CurrentWeatherLoading {...props} />,
  //   final: (props?: any) => <CurrentWeather {...props} />,
  // },
};

async function agent(inputs: {
  input: string;
  chat_history: [role: string, content: string][];
  file?: {
    base64: string;
    extension: string;
  };
}) {
  "use server";
  const remoteRunnable = new RemoteRunnable({
    url: API_URL,
  });

  let selectedToolComponent: ToolComponent | null = null;
  let selectedToolUI: ReturnType<typeof createStreamableUI> | null = null;

  /**
   * Handles the 'invoke_model' event by checking for tool calls in the output.
   * If a tool call is found and no tool component is selected yet, it sets the
   * selected tool component based on the tool type and appends its loading state to the UI.
   *
   * @param output - The output object from the 'invoke_model' event
   */
  const handleInvokeModelEvent = (
    event: StreamEvent,
    fields: EventHandlerFields,
  ) => {
    const [type] = event.event.split("_").slice(2);
    if (
      type !== "end" ||
      !event.data.output ||
      typeof event.data.output !== "object" ||
      event.name !== "invoke_model"
    ) {
      return;
    }

    if (
      "tool_calls" in event.data.output &&
      event.data.output.tool_calls.length > 0
    ) {
      const toolCall = event.data.output.tool_calls[0];
      if (!selectedToolComponent && !selectedToolUI) {
        selectedToolComponent = TOOL_COMPONENT_MAP[toolCall.type];
        selectedToolUI = createStreamableUI(selectedToolComponent.loading());
        fields.ui.append(selectedToolUI?.value);
      }
    }
  };

  /**
   * Handles the 'invoke_tools' event by updating the selected tool's UI
   * with the final state and tool result data.
   *
   * @param output - The output object from the 'invoke_tools' event
   */
  const handleInvokeToolsEvent = (event: StreamEvent) => {
    const [type] = event.event.split("_").slice(2);
    if (
      type !== "end" ||
      !event.data.output ||
      typeof event.data.output !== "object" ||
      event.name !== "invoke_tools"
    ) {
      return;
    }

    if (selectedToolUI && selectedToolComponent) {
      const toolData = event.data.output.tool_result;
      selectedToolUI.done(selectedToolComponent.final(toolData));
    }
  };

  /**
   * Handles the 'on_chat_model_stream' event by creating a new text stream
   * for the AI message if one doesn't exist for the current run ID.
   * It then appends the chunk content to the corresponding text stream.
   *
   * @param streamEvent - The stream event object
   * @param chunk - The chunk object containing the content
   */
  const handleChatModelStreamEvent = (
    event: StreamEvent,
    fields: EventHandlerFields,
  ) => {
    if (
      event.event !== "on_chat_model_stream" ||
      !event.data.chunk ||
      typeof event.data.chunk !== "object"
    )
      return;
    if (!fields.callbacks[event.run_id]) {
      const textStream = createStreamableValue();
      fields.ui.append(<AIMessage value={textStream.value}/>);
      fields.callbacks[event.run_id] = textStream;
    }

    if (fields.callbacks[event.run_id]) {
      fields.callbacks[event.run_id].append(event.data.chunk.content);
    }
  };

  return streamRunnableUI(
    remoteRunnable,
    {
      input: [
        ...inputs.chat_history.map(([role, content]) => ({
          type: role,
          content,
        })),
        {
          type: "human",
          content: inputs.input,
        },
      ],
    },
    {
      eventHandlers: [
        handleInvokeModelEvent,
        handleInvokeToolsEvent,
        handleChatModelStreamEvent,
      ],
    },
  );
}

export const EndpointsContext = exposeEndpoints({ agent });
