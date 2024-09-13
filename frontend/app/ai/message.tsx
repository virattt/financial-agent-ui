"use client";

import { AIMessageText } from "@/components/prebuilt/message";
import { StreamableValue, useStreamableValue } from "ai/rsc";

export function AIMessage(props: { value: StreamableValue<string> }) {
  const [data] = useStreamableValue(props.value);

  if (!data) {
    return null;
  }
  return <AIMessageText content={data} />;
}
