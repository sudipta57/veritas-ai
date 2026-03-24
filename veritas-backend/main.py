from contextlib import asynccontextmanager
import json
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline
import uvicorn

from api.routes import router
from utils.llm import call_llm

logger = logging.getLogger("veritasai")


AI_MODEL_NAME = "roberta-base-openai-detector"


async def startup_llm_check():
    try:
        result = await call_llm("You are a test.", "Reply with just the word: OK")
        logger.info("✓ Gemini LLM check passed: %s", result[:20])
    except Exception as e:
        logger.error("✗ Gemini LLM check FAILED: %s", str(e))


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
    await startup_llm_check()
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


@app.get("/api/test-sse")
async def test_sse():
    from sse_starlette.sse import EventSourceResponse
    import asyncio

    async def generator():
        for i in range(5):
            yield {"data": json.dumps({"stage": "test", "data": {"count": i}})}
            await asyncio.sleep(0.5)
        yield {"data": json.dumps({"stage": "complete", "data": {"count": "done"}})}

    return EventSourceResponse(generator())


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)