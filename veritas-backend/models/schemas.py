from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class InputType(str, Enum):
    TEXT = "TEXT"
    URL = "URL"
    PDF = "PDF"


class VerictType(str, Enum):
    TRUE = "TRUE"
    FALSE = "FALSE"
    PARTIALLY_TRUE = "PARTIALLY_TRUE"
    CONFLICTING = "CONFLICTING"
    UNVERIFIABLE = "UNVERIFIABLE"


VerdictType = VerictType


class CredibilityTier(str, Enum):
    TIER1 = "TIER1"
    TIER2 = "TIER2"
    TIER3 = "TIER3"


class VeritasInput(BaseModel):
    input_type: InputType
    content: str
    url: Optional[str] = None


class Claim(BaseModel):
    claim_id: str
    original_sentence: str
    atomic_claim: str
    is_temporal: bool = False


class Source(BaseModel):
    url: str
    title: str
    excerpt: str
    tier: CredibilityTier


class ClaimVerdict(BaseModel):
    claim_id: str
    claim: Claim
    verdict: VerdictType
    confidence: int = Field(ge=0, le=100)
    sources: list[Source]
    reasoning: str
    is_conflicting: bool
    conflict_position_a: Optional[str] = None
    conflict_position_b: Optional[str] = None


class AccuracyReport(BaseModel):
    report_id: str
    overall_score: int
    total_claims: int
    verdict_breakdown: dict
    claims: list[ClaimVerdict]
    ai_text_score: Optional[int] = None
    processing_time_seconds: float