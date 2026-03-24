from __future__ import annotations

import asyncio
import json
import logging
import time
from contextlib import suppress
from typing import Any

from fastapi import APIRouter, Request
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

from agents.claim_extractor import ClaimExtractorAgent
from agents.evidence_retrieval import EvidenceRetrievalAgent
from agents.preprocessor import PreprocessorAgent, extract_images_from_url
from agents.report_generator import ReportGeneratorAgent
from agents.verifier import VerifierAgent
from config import GEMINI_API_KEY, HIVE_API_KEY, TAVILY_API_KEY
from models.schemas import InputType, VeritasInput
from utils.media import detect_ai_media

router = APIRouter()
logger = logging.getLogger(__name__)

preprocessor_agent = PreprocessorAgent()
claim_extractor_agent = ClaimExtractorAgent()
evidence_retrieval_agent = EvidenceRetrievalAgent()
verifier_agent = VerifierAgent()
report_generator_agent = ReportGeneratorAgent()


class DetectAIRequest(BaseModel):
    text: str


def _sse_event(stage: str, data: dict) -> dict[str, str]:
    return {"data": json.dumps({"stage": stage, "data": data})}


def _ai_label_from_score(score: int) -> str:
    if score > 70:
        return "Likely AI-generated"
    if score >= 40:
        return "Possibly AI-generated"
    return "Likely human-written"


def _infer_ai_probability(result: dict[str, Any]) -> float:
    label = str(result.get("label", "")).strip().lower()
    confidence = float(result.get("score", 0.0))
    ai_labels = {"fake", "ai", "label_1", "generated"}

    if any(token in label for token in ai_labels):
        return confidence
    return 1.0 - confidence


async def _compute_ai_text_score(text: str, detector: Any) -> int | None:
    if detector is None:
        return None

    try:
        result = await asyncio.to_thread(detector, text[:5000], truncation=True)
        if not result:
            return None
        ai_probability = _infer_ai_probability(result[0])
        return int(round(max(0.0, min(1.0, ai_probability)) * 100))
    except Exception:
        return None


@router.get("/health")
def health_check() -> dict:
    return {
        "status": "ok",
        "checks": {
            "gemini": bool(GEMINI_API_KEY),
            "tavily": bool(TAVILY_API_KEY),
        },
    }


# Previous implementation (full) before this fix:
# @router.post("/verify")
# async def verify(input_data: VeritasInput, request: Request):
#     async def event_generator():
#         started_at = time.perf_counter()
#         ai_text_task: asyncio.Task[int | None] | None = None
#         media_task: asyncio.Task[list[dict]] | None = None
#
#         try:
#             yield _sse_event(
#                 "started",
#                 {
#                     "message": "Pipeline started",
#                     "input_type": input_data.input_type.value,
#                 },
#             )
#
#             yield _sse_event("preprocessing", {"message": "Extracting text..."})
#             preprocessed_text = await preprocessor_agent.process(input_data)
#             yield _sse_event(
#                 "preprocessed",
#                 {
#                     "message": "Text extracted",
#                     "char_count": len(preprocessed_text),
#                 },
#             )
#
#             ai_detector = getattr(request.app.state, "ai_detector", None)
#             ai_text_task = asyncio.create_task(
#                 _compute_ai_text_score(preprocessed_text, ai_detector)
#             )
#
#             if input_data.input_type == InputType.URL:
#                 source_url = input_data.url or input_data.content
#                 try:
#                     image_urls = await extract_images_from_url(source_url)
#                 except Exception:
#                     image_urls = []
#
#                 if image_urls and HIVE_API_KEY:
#                     media_task = asyncio.create_task(
#                         detect_ai_media(image_urls=image_urls, hive_api_key=HIVE_API_KEY)
#                     )
#
#             yield _sse_event("extracting", {"message": "Identifying verifiable claims..."})
#             claims = await claim_extractor_agent.extract(preprocessed_text)
#             yield _sse_event(
#                 "claims_found",
#                 {
#                     "message": f"{len(claims)} claims found",
#                     "claims": [claim.atomic_claim for claim in claims],
#                 },
#             )
#
#             yield _sse_event(
#                 "retrieving",
#                 {"message": f"Searching evidence for {len(claims)} claims..."},
#             )
#             evidence_by_claim = await evidence_retrieval_agent.retrieve_all(claims)
#
#             verdicts = []
#             for claim in claims:
#                 yield _sse_event(
#                     "verifying",
#                     {
#                         "message": f"Verifying claim {claim.claim_id}...",
#                         "claim_id": claim.claim_id,
#                     },
#                 )
#                 claim_sources = evidence_by_claim.get(claim.claim_id, [])
#                 verdict = await verifier_agent.verify_claim(claim, claim_sources)
#                 verdicts.append(verdict)
#
#             processing_time = time.perf_counter() - started_at
#             report = report_generator_agent.generate(
#                 verdicts=verdicts,
#                 processing_time=processing_time,
#             )
#
#             media_results: list[dict] = []
#             ai_text_score: int | None = None
#
#             if media_task is not None:
#                 with suppress(Exception):
#                     media_results = await media_task
#
#             if ai_text_task is not None:
#                 with suppress(Exception):
#                     ai_text_score = await ai_text_task
#
#             payload = report.model_dump()
#             payload["media_results"] = media_results
#             payload["ai_text_score"] = ai_text_score
#             yield _sse_event("complete", payload)
#         except Exception as exc:
#             yield _sse_event("error", {"message": str(exc)})
#
#     return EventSourceResponse(event_generator())
@router.post("/verify")
async def verify(input: VeritasInput, request: Request):
    async def event_generator():
        logger.info("▶ Pipeline started — input_type=%s", input.input_type)
        started_at = time.perf_counter()
        ai_text_task: asyncio.Task[int | None] | None = None
        media_task: asyncio.Task[list[dict]] | None = None

        try:
            yield {
                "data": json.dumps(
                    {
                        "stage": "started",
                        "data": {
                            "message": "Pipeline started",
                            "input_type": input.input_type.value,
                        },
                    }
                )
            }

            yield {
                "data": json.dumps(
                    {
                        "stage": "preprocessing",
                        "data": {"message": "Extracting text..."},
                    }
                )
            }
            preprocessed_text = await preprocessor_agent.process(input)
            yield {
                "data": json.dumps(
                    {
                        "stage": "preprocessed",
                        "data": {
                            "message": "Text extracted",
                            "char_count": len(preprocessed_text),
                        },
                    }
                )
            }

            ai_detector = getattr(request.app.state, "ai_detector", None)
            ai_text_task = asyncio.create_task(
                _compute_ai_text_score(preprocessed_text, ai_detector)
            )

            if input.input_type == InputType.URL:
                source_url = input.url or input.content
                try:
                    image_urls = await extract_images_from_url(source_url)
                except Exception:
                    image_urls = []

                if image_urls and HIVE_API_KEY:
                    media_task = asyncio.create_task(
                        detect_ai_media(image_urls=image_urls, hive_api_key=HIVE_API_KEY)
                    )

            if not preprocessed_text or len(preprocessed_text.strip()) < 20:
                logger.error("Preprocessed text is empty or too short: %r", preprocessed_text)
                yield {"data": json.dumps({
                    "stage": "error",
                    "data": {"message": "Could not extract text from input. Please paste text directly."}
                })}
                return

            yield {
                "data": json.dumps(
                    {
                        "stage": "extracting",
                        "data": {"message": "Identifying verifiable claims..."},
                    }
                )
            }
            claims = await claim_extractor_agent.extract(preprocessed_text)
            yield {
                "data": json.dumps(
                    {
                        "stage": "claims_found",
                        "data": {
                            "message": f"{len(claims)} claims found",
                            "claims": [claim.atomic_claim for claim in claims],
                        },
                    }
                )
            }

            yield {
                "data": json.dumps(
                    {
                        "stage": "retrieving",
                        "data": {
                            "message": f"Searching evidence for {len(claims)} claims..."
                        },
                    }
                )
            }
            evidence_by_claim = await evidence_retrieval_agent.retrieve_all(claims)

            verdicts = []
            for claim in claims:
                yield {
                    "data": json.dumps(
                        {
                            "stage": "verifying",
                            "data": {
                                "message": f"Verifying claim {claim.claim_id}...",
                                "claim_id": claim.claim_id,
                            },
                        }
                    )
                }
                claim_sources = evidence_by_claim.get(claim.claim_id, [])
                verdict = await verifier_agent.verify_claim(claim, claim_sources)
                verdicts.append(verdict)
                await asyncio.sleep(4)

            processing_time = time.perf_counter() - started_at
            report = report_generator_agent.generate(
                verdicts=verdicts,
                processing_time=processing_time,
            )

            media_results: list[dict] = []
            ai_text_score: int | None = None

            if media_task is not None:
                with suppress(Exception):
                    media_results = await media_task

            if ai_text_task is not None:
                with suppress(Exception):
                    ai_text_score = await ai_text_task

            payload = report.model_dump()
            payload["media_results"] = media_results
            payload["ai_text_score"] = ai_text_score
            yield {
                "data": json.dumps(
                    {
                        "stage": "complete",
                        "data": payload,
                    }
                )
            }
        except Exception as e:
            logger.error("✗ Pipeline error: %s", str(e), exc_info=True)
            yield {
                "data": json.dumps(
                    {
                        "stage": "error",
                        "data": {"message": str(e)},
                    }
                )
            }

    return EventSourceResponse(event_generator())


@router.post("/detect-ai")
async def detect_ai(request: DetectAIRequest, req: Request) -> dict[str, int | str]:
    ai_detector = getattr(req.app.state, "ai_detector", None)
    if ai_detector is None:
        raise RuntimeError("AI detector model is not loaded")

    result = await asyncio.to_thread(ai_detector, request.text[:5000], truncation=True)
    ai_probability = _infer_ai_probability(result[0])
    ai_score = int(round(max(0.0, min(1.0, ai_probability)) * 100))
    return {"ai_score": ai_score, "label": _ai_label_from_score(ai_score)}
