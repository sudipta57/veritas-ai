"""Preprocessor agent for normalizing and extracting input content."""

from __future__ import annotations

import asyncio
import base64
import unicodedata
from urllib.parse import urljoin, urlparse

import fitz
import httpx
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright

from models.schemas import InputType, VeritasInput


class PreprocessorAgent:
	"""Converts different input types into clean plain text."""

	async def process(self, veritasinput: VeritasInput) -> str:
		"""Route by input type and return clean extracted text."""
		if veritasinput.input_type == InputType.TEXT:
			return await self._process_text(veritasinput.content)

		if veritasinput.input_type == InputType.URL:
			target_url = veritasinput.url or veritasinput.content
			return await self._process_url(target_url)

		if veritasinput.input_type == InputType.PDF:
			return await self._process_pdf(veritasinput.content)

		raise ValueError(f"Unsupported input type: {veritasinput.input_type}")

	async def _process_text(self, content: str) -> str:
		"""Normalize unicode and collapse excessive whitespace."""
		normalized = unicodedata.normalize("NFKC", content or "")
		lines = [" ".join(line.split()) for line in normalized.splitlines()]
		cleaned = "\n\n".join(line for line in lines if line)
		return cleaned.strip()

	async def _process_url(self, url: str) -> str:
		"""Extract page text from URL with HTML-first and Playwright fallback."""
		first_attempt_text = ""

		try:
			async with asyncio.timeout(10):
				async with httpx.AsyncClient(follow_redirects=True) as client:
					response = await client.get(url)
					response.raise_for_status()

				soup = BeautifulSoup(response.text, "html.parser")
				paragraphs = [p.get_text(" ", strip=True) for p in soup.find_all("p")]
				first_attempt_text = "\n\n".join(text for text in paragraphs if text)
		except Exception:
			first_attempt_text = ""

		cleaned_first = await self._process_text(first_attempt_text)
		if len(cleaned_first) >= 200:
			return cleaned_first

		try:
			async with asyncio.timeout(10):
				async with async_playwright() as playwright:
					browser = await playwright.chromium.launch(headless=True)
					page = await browser.new_page()
					await page.goto(url, wait_until="domcontentloaded")
					body_text = await page.locator("body").inner_text()
					await browser.close()

			cleaned_fallback = await self._process_text(body_text)
			if cleaned_fallback:
				return cleaned_fallback
		except Exception as exc:
			raise ValueError(f"Content inaccessible: {url}") from exc

		raise ValueError(f"Content inaccessible: {url}")

	async def _process_pdf(self, content: str) -> str:
		"""Decode a base64 PDF and extract text across all pages."""
		try:
			pdf_bytes = base64.b64decode(content, validate=True)
			doc = fitz.open(stream=pdf_bytes, filetype="pdf")
		except Exception as exc:
			raise ValueError("Invalid PDF content") from exc

		page_text_chunks: list[str] = []
		for page in doc:
			page_text = page.get_text("text")
			if page_text:
				page_text_chunks.append(page_text.strip())
		doc.close()

		full_text = "\n\n".join(chunk for chunk in page_text_chunks if chunk)
		return await self._process_text(full_text)


async def extract_images_from_url(url: str) -> list[str]:
	"""Extract up to 10 absolute image URLs from a web page."""
	async with httpx.AsyncClient(follow_redirects=True, timeout=10) as client:
		response = await client.get(url)
		response.raise_for_status()

	soup = BeautifulSoup(response.text, "html.parser")
	image_urls: list[str] = []

	for image in soup.find_all("img"):
		src = (image.get("src") or "").strip()
		if not src:
			continue

		lower_src = src.lower()
		if lower_src.startswith("data:"):
			continue

		parsed = urlparse(src)
		is_relative = not parsed.scheme and not parsed.netloc and not src.startswith("//")
		if is_relative and len(src) < 10:
			continue

		absolute_url = urljoin(url, src)
		parsed_absolute = urlparse(absolute_url)
		if parsed_absolute.scheme not in {"http", "https"}:
			continue

		image_urls.append(absolute_url)
		if len(image_urls) >= 10:
			break

	return image_urls
