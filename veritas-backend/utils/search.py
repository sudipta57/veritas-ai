"""Search utilities for evidence retrieval."""

from tavily import TavilyClient
from duckduckgo_search import DDGS


def _is_rate_limit_error(exc: Exception) -> bool:
	status_code = getattr(exc, "status_code", None)
	if status_code == 429:
		return True

	response = getattr(exc, "response", None)
	if response is not None and getattr(response, "status_code", None) == 429:
		return True

	message = str(exc).lower()
	return "429" in message or "rate limit" in message


async def search_tavily(query: str, api_key: str) -> list[dict]:
	try:
		client = TavilyClient(api_key=api_key)
		response = client.search(query, search_depth="advanced", max_results=5)
		results = response.get("results", [])
		return [
			{
				"url": item.get("url", ""),
				"title": item.get("title", ""),
				"content": item.get("content", ""),
			}
			for item in results
		]
	except Exception as exc:
		if _is_rate_limit_error(exc):
			raise
		return []


async def search_duckduckgo(query: str) -> list[dict]:
	try:
		return [
			{
				"url": item.get("href", ""),
				"title": item.get("title", ""),
				"content": item.get("body", ""),
			}
			for item in DDGS().text(query, max_results=5)
		]
	except Exception as exc:
		if _is_rate_limit_error(exc):
			raise
		return []


async def search_with_fallback(query: str, tavily_key: str) -> list[dict]:
	tavily_results = await search_tavily(query, tavily_key)
	if tavily_results:
		return tavily_results

	ddg_results = await search_duckduckgo(query)
	if ddg_results:
		return ddg_results

	return []
