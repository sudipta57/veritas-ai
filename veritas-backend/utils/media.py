"""Utilities for AI-generated media detection."""

from __future__ import annotations

from urllib.parse import urlparse

import httpx


async def detect_ai_media(image_urls: list[str], hive_api_key: str) -> list[dict]:
    """Detect AI-generated likelihood for image URLs using Hive API."""
    if not hive_api_key:
        return []

    results: list[dict] = []
    headers = {"Authorization": f"Token {hive_api_key}"}

    async with httpx.AsyncClient(timeout=15) as client:
        for image_url in image_urls[:10]:
            path = (urlparse(image_url).path or "").lower()
            if path.endswith(".svg") or path.endswith(".gif"):
                continue

            try:
                response = await client.post(
                    "https://api.thehive.ai/api/v2/task/sync",
                    headers=headers,
                    json={"url": image_url},
                )
                response.raise_for_status()
                payload = response.json()

                classes = (
                    payload.get("status", [{}])[0]
                    .get("response", {})
                    .get("output", [{}])[0]
                    .get("classes", [])
                )

                ai_probability = 0.0
                for class_result in classes:
                    if class_result.get("class") == "ai_generated":
                        ai_probability = float(class_result.get("score", 0.0))
                        break

                results.append(
                    {
                        "url": image_url,
                        "ai_probability": ai_probability,
                        "is_ai_generated": ai_probability >= 0.8,
                    }
                )
            except httpx.HTTPError:
                continue

    return results
