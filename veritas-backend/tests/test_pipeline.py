import asyncio
import json
from typing import Any

import httpx


VERIFY_URL = "http://localhost:8000/api/verify"
PAYLOAD = {
    "input_type": "TEXT",
    "content": (
        "The Eiffel Tower is located in Berlin. It was built in 1889. "
        "The current population of France is approximately 68 million people."
    ),
}


def _try_parse_json(raw: str) -> Any:
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return raw


def _print_stage_event(event_payload: Any) -> None:
    if not isinstance(event_payload, dict):
        print(f"event: {event_payload}")
        return

    stage = event_payload.get("stage", "unknown")
    data = event_payload.get("data")
    print(f"[stage={stage}] data={json.dumps(data, ensure_ascii=False)}")


async def main() -> None:
    final_report: dict[str, Any] | None = None

    async with httpx.AsyncClient(timeout=None) as client:
        request = client.build_request("POST", VERIFY_URL, json=PAYLOAD)
        response = await client.send(request, stream=True)

        try:
            response.raise_for_status()
            print(f"Connected. status={response.status_code}")

            data_lines: list[str] = []
            async for raw_line in response.aiter_lines():
                line = raw_line.strip()

                if not line:
                    if not data_lines:
                        continue

                    raw_data = "\n".join(data_lines)
                    data_lines.clear()

                    parsed = _try_parse_json(raw_data)
                    _print_stage_event(parsed)

                    if isinstance(parsed, dict) and parsed.get("stage") == "complete":
                        payload = parsed.get("data")
                        if isinstance(payload, dict):
                            final_report = payload
                    continue

                if line.startswith(":"):
                    continue

                if line.startswith("data:"):
                    data_lines.append(line[len("data:") :].strip())

            if data_lines:
                raw_data = "\n".join(data_lines)
                parsed = _try_parse_json(raw_data)
                _print_stage_event(parsed)
                if isinstance(parsed, dict) and parsed.get("stage") == "complete":
                    payload = parsed.get("data")
                    if isinstance(payload, dict):
                        final_report = payload
        finally:
            await response.aclose()

    if not final_report:
        print("\nNo complete report received.")
        return

    print("\n=== Final Summary ===")
    overall_score = final_report.get("overall_score")
    print(f"overall_score: {overall_score}")

    claims = final_report.get("claims", [])
    if not isinstance(claims, list) or not claims:
        print("No claim verdicts found.")
        return

    for idx, claim_result in enumerate(claims, start=1):
        if not isinstance(claim_result, dict):
            print(f"{idx}. {claim_result}")
            continue

        claim_id = claim_result.get("claim_id", "N/A")
        verdict = claim_result.get("verdict", "N/A")
        print(f"{idx}. claim_id={claim_id} verdict={verdict}")


if __name__ == "__main__":
    asyncio.run(main())
