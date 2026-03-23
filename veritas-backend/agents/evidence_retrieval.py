"""Evidence retrieval agent implementation."""

from __future__ import annotations

import asyncio

from config import TAVILY_API_KEY
from models.schemas import Claim, Source
from utils.credibility import score_credibility
from utils.llm import call_llm
from utils.search import search_with_fallback


class EvidenceRetrievalAgent:
	"""Retrieve and score web evidence for extracted claims."""

	def __init__(self) -> None:
		self.tavily_key = TAVILY_API_KEY or ""

	async def retrieve_all(self, claims: list[Claim]) -> dict[str, list[Source]]:
		"""Retrieve evidence for all claims concurrently with bounded workers."""
		semaphore = asyncio.Semaphore(5)
		claim_results = await asyncio.gather(
			*(self._retrieve_for_claim(claim, semaphore) for claim in claims)
		)
		return {claim_id: sources for claim_id, sources in claim_results}

	async def _retrieve_for_claim(
		self,
		claim: Claim,
		semaphore: asyncio.Semaphore,
	) -> tuple[str, list[Source]]:
		"""Retrieve and normalize evidence for a single claim."""
		async with semaphore:
			query = await self._build_query(claim)
			results = await self._search_with_backoff(query)

			if not results:
				reformulated_query = await self._reformulate_query(claim)
				results = await self._search_with_backoff(reformulated_query)

			sources: list[Source] = []
			for result in results:
				url = str(result.get("url", "")).strip()
				if not url:
					continue

				tier = score_credibility(url)
				if tier is None:
					continue

				sources.append(
					Source(
						url=url,
						title=str(result.get("title", "")).strip(),
						excerpt=str(result.get("content", "")).strip(),
						tier=tier,
					)
				)

			return claim.claim_id, sources

	async def _build_query(self, claim: Claim) -> str:
		"""Build a direct search query from the atomic claim."""
		return claim.atomic_claim.strip()[:200]

	async def _reformulate_query(self, claim: Claim) -> str:
		"""Reformulate claim text into a shorter broad web query."""
		prompt = (
			"Rephrase this claim as a shorter, broader web search query (under 10 words).\n"
			"Return only the query string, no punctuation, no explanation.\n"
			f"Claim: {claim.atomic_claim}"
		)

		result = await call_llm("", prompt)
		return result.strip()

	async def _search_with_backoff(self, query: str) -> list[dict]:
		"""Search with 429 exponential backoff: 1s, 2s, 4s."""
		delays = [1, 2, 4]

		for attempt, delay in enumerate(delays, start=1):
			try:
				return await search_with_fallback(query, self.tavily_key)
			except Exception as exc:
				if not self._is_rate_limit_error(exc):
					return []

				if attempt == len(delays):
					return []

				await asyncio.sleep(delay)

		return []

	def _is_rate_limit_error(self, exc: Exception) -> bool:
		"""Detect whether an exception corresponds to HTTP 429 rate limiting."""
		status_code = getattr(exc, "status_code", None)
		if status_code == 429:
			return True

		response = getattr(exc, "response", None)
		if response is not None and getattr(response, "status_code", None) == 429:
			return True

		message = str(exc).lower()
		return "429" in message or "rate limit" in message
