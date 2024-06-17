## Welcome 👋

This is a generative UI financial agent.

We use Vercel's AI [SDK](https://sdk.vercel.ai/docs/introduction) and
LangChain [agents](https://python.langchain.com/v0.1/docs/modules/agents/) to dynamically answer and render UI.

In addition, we use Polygon's [Stocks API](https://polygon.io/docs/stocks) to get real-time stock data and financials.

[![Twitter Follow](https://img.shields.io/twitter/follow/virattt?style=social)](https://twitter.com/virattt)

## Getting Started 🚀

![Screenshot 2024-06-05 at 9 27 43 PM](https://github.com/virattt/financial-agent-ui/assets/901795/4d93823f-d795-4aff-ac9e-93053087bed9)

Make sure that you have an OpenAI and Polygon API key.

1. Download the repo locally:
    ```
    git clone https://github.com/virattt/financial-agent-ui.git
    ```

2. Create a `.env` file in the root project directory (next to `.env.example`) and add the following:

   ```
   OPENAI_API_KEY=YOUR_OPENAI_API_KEY      # Get one at https://platform.openai.com
   POLYGON_API_KEY=YOUR_POLYGON_API_KEY    # Get one at https://polygon.io
   ```

3. Install the `backend` server:

- Instructions [here](https://github.com/virattt/financial-agent-ui/blob/main/backend/README.md)

4. Install the `frontend` app:

- Instructions [here](https://github.com/virattt/financial-agent-ui/blob/main/frontend/README.md)

## Disclaimer 🛑

The goal of this application is **only** to explore generative AI and UI.

This financial agent is **not intended as financial advice**. It is designed to provide users with tools and information
to explore technical concepts with respect to generative AI only. Users should conduct their own research or consult
with a financial advisor before making any financial decisions.

## Contributing 👷‍♂️

Contributions are welcome! If you find any issues or have suggestions for improvements,
please open an issue or submit a pull request.

## License 📜

This project is licensed under the [MIT License](link-to-license-file).

## Contributors ❤️

<a href="https://github.com/virattt/financial-agent-ui/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=virattt/financial-agent-ui" />
</a>
