import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from gen_ui_backend.chain import create_graph
from gen_ui_backend.chat_types import ChatInputType
from langserve import add_routes

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="Gen UI Backend",
    version="1.0",
    description="A simple api server using Langchain's Runnable interfaces",
)

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

graph = create_graph()

runnable = graph.with_types(input_type=ChatInputType, output_type=dict)

add_routes(app, runnable, path="/chat", playground_type="chat")


def start() -> None:
    print("Starting server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)


if __name__ == "__main__":
    start()
