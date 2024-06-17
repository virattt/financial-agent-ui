## Generative UI - Backend

This is the backend server for the generative UI financial agent.

## Getting Started 🚀

1. Navigate to this backend directory:

   ```
   cd financial-agent-ui/backend
   ```

2. Create a `.env` file in the project directory (next to `.env.example`) and add the following:

   ```
   LANGCHAIN_API_KEY=                     # Get one at https://smith.langchain.com
   LANGCHAIN_CALLBACKS_BACKGROUND=true
   LANGCHAIN_TRACING_V2=true
   
   POLYGON_API_KEY=                       # Get one at https://polygon.io
   OPENAI_API_KEY=                        # Get one at https://platform.openai.com
   ```
3. Install dependencies (if using **poetry**):

   ```
   poetry install
   ```

4. Install dependencies (if using **pip**):

   ```
   pip install -r requirements.txt
   ```

5. Run the backend server (if using **poetry**):

   ```
   poetry run start
   ```

6. Run the backend server (if using **pip**):

   ```
   python -m gen_ui_backend.server
   ```

7. If successful, you should see something like this in your terminal:
   ![Screenshot 2024-06-17 at 7 19 50 PM](https://github.com/virattt/financial-agent-ui/assets/901795/75d8292b-0d1f-4198-8a23-3e685bb4327f)


8. Navigate to `localhost:8000/docs` in your browser to see the API docs!
   ![Screenshot 2024-06-17 at 7 21 18 PM](https://github.com/virattt/financial-agent-ui/assets/901795/ddad5a43-2338-454b-b4ed-cf0b5dbdf1ee)

