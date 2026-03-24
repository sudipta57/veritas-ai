"""Claim extractor agent powered by Google Gemini."""

from __future__ import annotations

import json
import logging
import re

from models.schemas import Claim
from utils.llm import call_llm

logger = logging.getLogger("veritasai")


class ClaimExtractorAgent:
	"""Extract atomic factual claims from cleaned text."""

	def __init__(self) -> None:
		pass

	def _clean_llm_json(self, raw: str) -> str:
		import re
		# Remove markdown fences
		cleaned = re.sub(r'```(?:json)?\s*', '', raw)
		cleaned = re.sub(r'```', '', cleaned)
		cleaned = cleaned.strip()
		
		# Find the JSON array boundaries — extract only the
		# content between the first [ and last ]
		start = cleaned.find('[')
		end = cleaned.rfind(']')
		if start != -1 and end != -1 and end > start:
			cleaned = cleaned[start:end+1]
		
		return cleaned

	async def extract(self, text: str) -> list[Claim]:
		"""Extract claims and return them as validated Claim models."""
		raw_output = await self._run_extraction_prompt(text)

		try:
			parsed = json.loads(self._clean_llm_json(raw_output))
		except json.JSONDecodeError:
			raw_output = await self._run_extraction_prompt(text, retry=True)
			try:
				parsed = json.loads(self._clean_llm_json(raw_output))
			except json.JSONDecodeError as exc:
				logger.error("[ClaimExtractor] Raw output that failed to parse:\n%s", raw_output)
				raise ValueError("Failed to parse claim extraction JSON output") from exc

		if not isinstance(parsed, list):
			raise ValueError("Claim extraction output must be a JSON array")

		claims: list[Claim] = []
		for item in parsed[:25]:
			if not isinstance(item, dict):
				continue
			claims.append(Claim(**item))

		return claims

	async def _run_extraction_prompt(self, text: str, retry: bool = False) -> str:
		"""Run the extraction prompt and return model raw text output."""
		system_prompt = (
			"You are a precise claim extraction engine. Your job is to decompose text into atomic,\n"
			"independently verifiable factual claims. You must follow these rules strictly:\n"
			"1. Each claim must be a single, self-contained factual assertion.\n"
			"2. Do NOT include opinions, predictions, or normative statements (should/ought/better).\n"
			"3. Do NOT conflate two facts into one claim.\n"
			"4. Deduplicate semantically identical claims.\n"
			"5. For each claim, record the index of the sentence in the original text it came from (0-indexed).\n"
			"6. Mark claims containing words like 'currently', 'as of', 'latest', 'recent', 'now' as temporal=true.\n"
			"Think step by step before outputting. Output ONLY valid JSON, no markdown, no explanation."
		)

		user_message = (
			"Extract all verifiable claims from the following text.\n"
			"Return a JSON array where each object has:\n"
			"- claim_id: string like 'C001', 'C002', etc.\n"
			"- original_sentence: the verbatim sentence from the source text\n"
			"- atomic_claim: the rewritten self-contained factual claim\n"
			"- is_temporal: boolean\n\n"
			"Text:\n"
			f"{text}"
		)

		if retry:
			user_message = f"Your previous attempt returned invalid JSON. Try again. {user_message}"

		result = await call_llm(system_prompt, user_message)
		return result.strip()
