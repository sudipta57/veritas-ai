"""Verifier agent implementation for claim-level fact checking."""

from __future__ import annotations

import asyncio
import ast
import json
import re

from models.schemas import Claim, ClaimVerdict, Source, VerdictType
from utils.llm import call_llm


class VerifierAgent:
	"""Verify a single claim against retrieved sources using Gemini."""

	def __init__(self) -> None:
		pass

	def _clean_llm_json(self, raw: str) -> str:
		# Strip markdown code fences that Gemini adds despite being told not to
		cleaned = re.sub(r'```(?:json)?\s*', '', raw)
		cleaned = re.sub(r'```', '', cleaned)
		return cleaned.strip()

	async def verify_claim(self, claim: Claim, sources: list[Source]) -> ClaimVerdict:
		"""Run conflict-aware verification with a self-reflection safety pass."""
		if not sources:
			return ClaimVerdict(
				claim_id=claim.claim_id,
				claim=claim,
				verdict=VerdictType.UNVERIFIABLE,
				confidence=0,
				sources=[],
				reasoning="No sources were available to verify this claim.",
				is_conflicting=False,
			)

		has_conflict, position_a, position_b = await self._check_conflict(claim, sources)
		if has_conflict:
			return self._build_conflicting_verdict(claim, sources, position_a, position_b)

		await asyncio.sleep(4)
		initial_verdict = await self._run_verification(claim, sources)
		await asyncio.sleep(4)
		final_verdict = await self._self_reflection_check(claim, sources, initial_verdict)

		return ClaimVerdict(
			claim_id=claim.claim_id,
			claim=claim,
			verdict=self._normalize_verdict(final_verdict.get("verdict")),
			confidence=self._resolve_confidence(
				self._normalize_verdict(final_verdict.get("verdict")),
				final_verdict.get("confidence", 0),
				has_sources=bool(sources),
			),
			sources=sources,
			reasoning=str(final_verdict.get("reasoning", "")).strip()
			or "Insufficient evidence to produce a reliable verdict.",
			is_conflicting=False,
		)

	async def _check_conflict(self, claim: Claim, sources: list[Source]) -> tuple[bool, str, str]:
		"""Detect direct contradiction among sources for a given claim."""
		system_prompt = (
			"You are a conflict detection engine. Analyze whether the provided sources contradict "
			"each other regarding the specific claim. Be precise — minor wording differences are NOT conflicts. "
			"A conflict means Source A says X is true and Source B says X is false or the opposite."
		)

		user_prompt = (
			f"Claim: {claim.atomic_claim}\n"
			f"Sources: {self._format_sources(sources)}\n\n"
			"Do these sources directly contradict each other about this claim?\n"
			"Reply ONLY with valid JSON:\n"
			"{\n"
			"  'has_conflict': true/false,\n"
			"  'position_a': 'summary of position from first group of sources (or null)',\n"
			"  'position_b': 'summary of opposing position (or null)'\n"
			"}"
		)

		try:
			raw_output = await call_llm(system_prompt, user_prompt)
			result = json.loads(self._clean_llm_json(raw_output))
		except Exception:
			return False, "", ""

		has_conflict = bool(result.get("has_conflict", False))
		position_a = str(result.get("position_a") or "").strip()
		position_b = str(result.get("position_b") or "").strip()
		return has_conflict, position_a, position_b

	async def _run_verification(self, claim: Claim, sources: list[Source]) -> dict:
		"""Classify the claim verdict using only provided sources."""
		system_prompt = (
			"You are a fact verification engine. You may ONLY use the provided sources to "
			"determine the verdict. Do not use your training knowledge. If the sources do not contain "
			"enough information, return UNVERIFIABLE. "
			"If the claim contains an approximate number (words like 'approximately', 'around', "
			"'about', 'roughly') and the retrieved sources show a number within 20% of the stated "
			"value, classify as PARTIALLY_TRUE with appropriate confidence, not UNVERIFIABLE. "
			"Only return UNVERIFIABLE if sources contain zero relevant information about the claim topic."
		)

		user_prompt = (
			f"Claim: {claim.atomic_claim}\n"
			f"Sources: {self._format_sources(sources)}\n\n"
			"Classify this claim as one of: TRUE, FALSE, PARTIALLY_TRUE, UNVERIFIABLE.\n"
			"Calculate a confidence score 0-100 based on:\n"
			"- number of corroborating sources (more = higher)\n"
			"- credibility tier of sources (T1 > T2 > T3)\n"
			"- consistency of evidence\n\n"
			"Reply ONLY with valid JSON:\n"
			"{\n"
			"  'verdict': 'TRUE|FALSE|PARTIALLY_TRUE|UNVERIFIABLE',\n"
			"  'confidence': integer,\n"
			"  'reasoning': 'one paragraph explanation citing the sources used'\n"
			"}"
		)

		try:
			raw_output = await call_llm(system_prompt, user_prompt)
			result = json.loads(self._clean_llm_json(raw_output))
		except Exception:
			return {
				"verdict": "UNVERIFIABLE",
				"confidence": 20,
				"reasoning": "Verification could not be completed from the provided sources.",
			}

		normalized_verdict = self._normalize_verdict(result.get("verdict"))
		return {
			"verdict": normalized_verdict.value,
			"confidence": self._resolve_confidence(
				normalized_verdict,
				result.get("confidence", 0),
				has_sources=bool(sources),
			),
			"reasoning": str(result.get("reasoning", "")).strip()
			or "The provided sources do not contain enough consistent evidence.",
		}

	async def _self_reflection_check(self, claim: Claim, sources: list[Source], verdict: dict) -> dict:
		"""Audit whether reasoning is fully grounded in provided sources."""
		system_prompt = "You are a hallucination auditor."
		user_prompt = (
			"Review this fact-check verdict:\n"
			f"Claim: {claim.atomic_claim}\n"
			f"Verdict: {verdict.get('verdict', 'UNVERIFIABLE')}\n"
			f"Reasoning: {verdict.get('reasoning', '')}\n"
			f"Available sources: {self._format_sources(sources)}\n\n"
			"Is every statement in the reasoning directly supported by the provided sources?\n"
			"If any part of the reasoning uses knowledge NOT present in the sources, change the verdict to "
			"UNVERIFIABLE and update the reasoning to explain why.\n"
			"Reply ONLY with valid JSON using the same schema: verdict, confidence, reasoning."
		)

		try:
			raw_output = await call_llm(system_prompt, user_prompt)
			result = json.loads(self._clean_llm_json(raw_output))
		except Exception:
			fallback_verdict = self._normalize_verdict(verdict.get("verdict"))
			return {
				"verdict": fallback_verdict.value,
				"confidence": self._resolve_confidence(
					fallback_verdict,
					verdict.get("confidence", 0),
					has_sources=bool(sources),
				),
				"reasoning": str(verdict.get("reasoning", "")).strip()
				or "Insufficient source-grounded reasoning available.",
			}

		audited_verdict = self._normalize_verdict(result.get("verdict"))
		return {
			"verdict": audited_verdict.value,
			"confidence": self._resolve_confidence(
				audited_verdict,
				result.get("confidence", verdict.get("confidence", 0)),
				has_sources=bool(sources),
			),
			"reasoning": str(result.get("reasoning", "")).strip()
			or str(verdict.get("reasoning", "")).strip()
			or "Insufficient source-grounded reasoning available.",
		}

	def _build_conflicting_verdict(
		self,
		claim: Claim,
		sources: list[Source],
		position_a: str,
		position_b: str,
	) -> ClaimVerdict:
		"""Build a CONFLICTING verdict when sources directly oppose each other."""
		return ClaimVerdict(
			claim_id=claim.claim_id,
			claim=claim,
			verdict=VerdictType.CONFLICTING,
			confidence=50,
			sources=sources,
			reasoning=(
				"Sources directly conflict on this claim, with one set supporting one position "
				"and another set supporting the opposite."
			),
			is_conflicting=True,
			conflict_position_a=position_a or None,
			conflict_position_b=position_b or None,
		)

	def _format_sources(self, sources: list[Source]) -> str:
		"""Format sources for LLM prompts with tier labels, titles, and excerpts."""
		formatted: list[str] = []
		for source in sources:
			tier_label = self._tier_label(source)
			title = source.title.strip() or "Untitled"
			excerpt = source.excerpt.strip() or "No excerpt provided."
			formatted.append(f"[{tier_label}] {title} - {excerpt}")
		return "\n".join(formatted)

	def _tier_label(self, source: Source) -> str:
		"""Convert enum tier names to compact T1/T2/T3 labels."""
		if source.tier.value == "TIER1":
			return "T1"
		if source.tier.value == "TIER2":
			return "T2"
		return "T3"

	async def _call_llm_json(self, system_prompt: str, user_prompt: str) -> dict:
		"""Call LLM and parse its response as JSON-like dict."""
		raw_text = await call_llm(system_prompt, user_prompt)
		return self._parse_json_like(raw_text)

	def _parse_json_like(self, payload: str) -> dict:
		"""Parse strict JSON first, then safely parse Python-style dicts."""
		text = payload.strip()
		if text.startswith("```"):
			text = text.strip("`")
			if text.lower().startswith("json"):
				text = text[4:].strip()

		try:
			parsed = json.loads(text)
		except json.JSONDecodeError:
			start = text.find("{")
			end = text.rfind("}")
			if start != -1 and end != -1 and end > start:
				text = text[start : end + 1]
			try:
				parsed = json.loads(text)
			except json.JSONDecodeError:
				parsed = ast.literal_eval(text)

		if not isinstance(parsed, dict):
			raise ValueError("Expected a JSON object")
		return parsed

	def _normalize_verdict(self, verdict: object) -> VerdictType:
		"""Normalize model verdict strings into the VerdictType enum."""
		value = str(verdict or "").strip().upper()
		if value in {
			VerdictType.TRUE.value,
			VerdictType.FALSE.value,
			VerdictType.PARTIALLY_TRUE.value,
			VerdictType.CONFLICTING.value,
			VerdictType.UNVERIFIABLE.value,
		}:
			return VerdictType(value)
		return VerdictType.UNVERIFIABLE

	def _clamp_confidence(self, confidence: object) -> int:
		"""Coerce confidence into integer range [0, 100]."""
		try:
			value = int(confidence)
		except (TypeError, ValueError):
			return 0
		return max(0, min(100, value))

	def _resolve_confidence(self, verdict: VerdictType, confidence: object, has_sources: bool) -> int:
		"""Apply verdict-aware confidence policy and clamp to valid bounds."""
		if verdict == VerdictType.UNVERIFIABLE:
			return 20 if has_sources else 0
		return max(30, self._clamp_confidence(confidence))
