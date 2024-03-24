//@ts-ignore
import { OpenAI } from "openai";
import {
  createAI,
  createStreamableValue,
  getMutableAIState,
  render,
} from "ai/rsc";
import { z } from "zod";
import { nanoid } from "ai";
import { BotCard, BotMessage, SpinnerMessage } from "@/components/llm/message";
import { sleep } from "openai/core.mjs";

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

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
  let textNode: undefined | React.ReactNode;

  const ui = render({
    model: "gpt-3.5-turbo",
    provider: openai,
    initial: <SpinnerMessage />,
    messages: [
      {
        role: "system",
        content: `\
  You are a stock trading conversation bot and you can help users buy stocks, step by step.
  You and the user can discuss stock prices and the user can adjust the amount of stocks they want to buy, or place an order, in the UI.
  
  Messages inside [] means that it's a UI element or a user event. For example:
  - "[Price of AAPL = 100]" means that an interface of the stock price of AAPL is shown to the user.
  - "[User has changed the amount of AAPL to 10]" means that the user has changed the amount of AAPL to 10 in the UI.
  
  If the user requests purchasing a stock, call \`show_stock_purchase_ui\` to show the purchase UI.
  If the user just wants the price, call \`show_stock_price\` to show the price.
  If you want to show trending stocks, call \`list_stocks\`.
  If you want to show events, call \`get_events\`.
  If the user wants to sell stock, or complete another impossible task, respond that you are a demo and cannot do that.
  
  Besides that, you can also chat with users and do some calculations if needed.`,
      },
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name,
      })),
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue("");
        textNode = <BotMessage content={textStream.value} />;
      }

      if (done) {
        textStream.done();
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: "assistant",
              content,
            },
          ],
        });
      } else {
        textStream.update(delta);
      }

      return textNode;
    },
    functions: {
      listStocks: {
        description: "List three imaginary stocks that are trending.",
        parameters: z.object({
          stocks: z.array(
            z.object({
              symbol: z.string().describe("The symbol of the stock"),
              price: z.number().describe("The price of the stock"),
              delta: z.number().describe("The change in price of the stock"),
            })
          ),
        }),
        render: async function* ({ stocks }) {
          yield (
            <BotCard>
              <div>skeleton lol</div>
            </BotCard>
          );

          await sleep(1000);

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: "function",
                name: "listStocks",
                content: JSON.stringify(stocks),
              },
            ],
          });

          return <BotCard>stonks!</BotCard>;
        },
      },
      showStockPrice: {
        description:
          "Get the current stock price of a given stock or currency. Use this to show the price to the user.",
        parameters: z.object({
          symbol: z
            .string()
            .describe(
              "The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD."
            ),
          price: z.number().describe("The price of the stock."),
          delta: z.number().describe("The change in price of the stock"),
        }),
        render: async function* ({ symbol, price, delta }) {
          yield <BotCard>stonks loading!</BotCard>;

          await sleep(1000);

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: "function",
                name: "showStockPrice",
                content: JSON.stringify({ symbol, price, delta }),
              },
            ],
          });

          return <BotCard>stonks!</BotCard>;
        },
      },
      showStockPurchase: {
        description:
          "Show price and the UI to purchase a stock or currency. Use this if the user wants to purchase a stock or currency.",
        parameters: z.object({
          symbol: z
            .string()
            .describe(
              "The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD."
            ),
          price: z.number().describe("The price of the stock."),
          numberOfShares: z
            .number()
            .describe(
              "The **number of shares** for a stock or currency to purchase. Can be optional if the user did not specify it."
            ),
        }),
        render: async function* ({ symbol, price, numberOfShares = 100 }) {
          if (numberOfShares <= 0 || numberOfShares > 1000) {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: "system",
                  content: `[User has selected an invalid amount]`,
                },
              ],
            });

            return <BotMessage content={"Invalid amount"} />;
          }

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: "function",
                name: "showStockPurchase",
                content: JSON.stringify({
                  symbol,
                  price,
                  numberOfShares,
                }),
              },
            ],
          });

          return <BotCard>buy lol</BotCard>;
        },
      },
      getEvents: {
        description:
          "List funny imaginary events between user highlighted dates that describe stock activity.",
        parameters: z.object({
          events: z.array(
            z.object({
              date: z
                .string()
                .describe("The date of the event, in ISO-8601 format"),
              headline: z.string().describe("The headline of the event"),
              description: z.string().describe("The description of the event"),
            })
          ),
        }),
        render: async function* ({ events }) {
          yield <BotCard>loading events lol</BotCard>;

          await sleep(1000);

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: "function",
                name: "getEvents",
                content: JSON.stringify(events),
              },
            ],
          });

          return <BotCard>events lol</BotCard>;
        },
      },
    },
  });

  return {
    id: nanoid(),
    display: ui,
  };
}

export type Message = {
  role: "user" | "assistant" | "system" | "function" | "data" | "tool";
  content: string;
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
