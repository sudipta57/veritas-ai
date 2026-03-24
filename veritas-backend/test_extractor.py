import asyncio
import sys
sys.path.insert(0, '.')

from agents.claim_extractor import ClaimExtractorAgent

async def test():
    agent = ClaimExtractorAgent()
    test_text = "The Eiffel Tower is located in Paris. It was built in 1889."
    print("Calling extract()...")
    try:
        result = await agent.extract(test_text)
        print(f"SUCCESS: {len(result)} claims extracted")
        for c in result:
            print(f"  - {c.claim_id}: {c.atomic_claim}")
    except Exception as e:
        print(f"FAILED: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()

asyncio.run(test())
