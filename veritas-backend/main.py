from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline
import uvicorn

from api.routes import router


AI_MODEL_NAME = "roberta-base-openai-detector"


@asynccontextmanager
async def lifespan(app: FastAPI):
    tokenizer = AutoTokenizer.from_pretrained(AI_MODEL_NAME)
    model = AutoModelForSequenceClassification.from_pretrained(AI_MODEL_NAME)
    app.state.ai_detector = pipeline(
        "text-classification",
        model=model,
        tokenizer=tokenizer,
    )
    print("VeritasAI backend started")
    yield


app = FastAPI(title="VeritasAI Backend", version="1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)