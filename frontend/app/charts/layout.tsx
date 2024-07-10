import "../globals.css";
import type { Metadata } from "next";

import { EndpointsContext } from "./agent";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "LangChain.js Gen UI",
  description: "Generative UI application with LangChain.js",
};

export default function RootLayout(props: { children: ReactNode }) {
  return <EndpointsContext>{props.children}</EndpointsContext>;
}
