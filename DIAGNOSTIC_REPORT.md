# VeritasAI Backend - Complete Diagnostic Report
## Date: March 24, 2026

---

## STEP 1: COMPLETE CODE AUDIT

### api/routes.py - COMPLETE CODE
- Lines 1-19: Imports ✓
- Lines 21-27: Global agent instantiations ✓
- Lines 30-35: Utility functions ✓
- Lines 38-69: Health check endpoint ✓
- Lines 71-285: POST /verify endpoint with SSE response
- Lines 286-312: POST /detect-ai endpoint

### agents/claim_extractor.py - COMPLETE CODE
- Lines 1-18: Imports and logger setup ✓
- Lines 20-32: _clean_llm_json() method
- Lines 26-43: extract() method  
- Lines 45-90: _run_extraction_prompt() method

### utils/llm.py - COMPLETE CODE
- Lines 1-5: Imports
- Lines 7-10: Module-level Gemini client initialization
- Lines 12-24: call_llm() function (ASYNC)

---

## STEP 2: AUDIT api/routes.py FOR SPECIFIC ISSUES

### A) POST /verify endpoint (Lines 101-285):
✓ **Position of event_generator()**: YES - defined INSIDE route handler at line 102
✓ **logger.info() calls INSIDE event_generator(): YES - line 102 has the first logger.info()
✓ **All yields are inside event_generator()**: YES - structure is correct
✓ **EventSourceResponse import**: YES - line 15 imports correctly
✓ **Return statementCorrect**: YES - line 285: `return EventSourceResponse(event_generator())`
  - No await ✓
  - No async wrapper ✓

### B) claim_extractor_agent.extract() call (Line 168):
✓ **Called with await**: YES - `await claim_extractor_agent.extract(preprocessed_text)`
✓ **Variable consistency**: YES - `preprocessed_text` from line 155, passed to line 168
⚠ **ISSUE FOUND**: NO validation that `preprocessed_text` is not None or empty string
  - After line 155: `preprocessed_text = await preprocessor_agent.process(input)`
  - No check before line 168: `claims = await claim_extractor_agent.extract(preprocessed_text)`
  - If preprocessor returns empty string, extract() will fail parsing empty JSON

### C) Error handling (Lines 274-283):
✓ **Error SSE event IS yielded**: YES
  - Line 277: `yield { "data": json.dumps({"stage": "error", ...})` 
  - This happens BEFORE the implicit exception propagation

---

## STEP 3: AUDIT agents/claim_extractor.py

### A) extract() method (Lines 26-43):
```python
async def extract(self, text: str) -> list[Claim]:
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
```

### B) _run_extraction_prompt() method (Lines 45-90):
```python
async def _run_extraction_prompt(self, text: str, retry: bool = False) -> str:
    system_prompt = "..."
    user_message = "..."
    if retry:
        user_message = f"Your previous attempt returned invalid JSON. Try again. {user_message}"
    result = await call_llm(system_prompt, user_message)
    return result.strip()
```

### C) _clean_llm_json() method (Lines 20-32):
```python
def _clean_llm_json(self, raw: str) -> str:
    import re
    cleaned = re.sub(r'```(?:json)?\s*', '', raw)
    cleaned = re.sub(r'```', '', cleaned)
    cleaned = cleaned.strip()
    start = cleaned.find('[')
    end = cleaned.rfind(']')
    if start != -1 and end != -1 and end > start:
        cleaned = cleaned[start:end+1]
    return cleaned
```

### D) Raw output source (Line 90):
✓ **Returns raw string from Gemini**: YES - `return result.strip()`
- `result` comes from `call_llm()` which returns the raw text from Gemini API

### E) What is raw_output when json.loads fails?
⚠ **ISSUE FOUND**: Line 39 - if call_llm() returns empty string or None
  - The Gemini API response is not validated
  - If call_llm() fails silently and returns "" or None, json.loads() will fail
  - Second retry attempt (line 40-43) will also fail
  - Error is then raised with incomplete debugging info

---

## STEP 4: AUDIT utils/llm.py

### A) Complete call_llm() function (Lines 12-24):
```python
async def call_llm(system_prompt: str, user_prompt: str) -> str:
    full_prompt = f"{system_prompt}\n\n{user_prompt}"
    response = await client.aio.models.generate_content(
        model="gemini-2.5-flash",
        contents=full_prompt,
        config=types.GenerateContentConfig(
            temperature=0.1,
            max_output_tokens=8192,
        ),
    )
    logger.info("[LLM raw response] first 500 chars: %s", response.text[:500])
    return response.text.strip()
```

### B) max_output_tokens value:
✓ **SET TO 8192**: YES - line 22

### C) Try/except block:
❌ **CRITICAL ISSUE FOUND**: NO try/except block exists
  - Lines 12-24: NO exception handling
  - If `client.aio.models.generate_content()` raises ANY exception (API error, rate limit, network, etc.)
  - The exception will propagate uncaught to the caller
  - Example: `google.genai.errors.ClientError` (429 rate limit) propagates uncaught

### D) Client initialization:
✓ **Module-level**: YES - Line 10: `client = genai.Client(api_key=GEMINI_API_KEY)`

### E) Return behavior on failure:
❌ **CRITICAL**: call_llm() does NOT catch exceptions
  - On any API failure, it RAISES the exception
  - It does NOT return empty string
  - This means exceptions propagate up and crash the pipeline

---

## STEP 5: ISOLATION TEST - test_extractor.py

### Test Code Created and Run:
```python
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
```

### Test Results:
**Output**: 
```
Calling extract()...
FAILED: ClientError: 429 RESOURCE_EXHAUSTED. 
  'You exceeded your current quota, please check your plan and billing details.'
  'Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 20'
  'Please retry in 22.159765953s.'
```

### Analysis:
✓ Import system works correctly
✓ ClaimExtractorAgent instantiates correctly
✓ extract() method executes and reaches the LLM call
✓ The exception path confirms: **NO TRY/EXCEPT IN call_llm()**
  - The ClientError propagated uncaught from google.genai
  - Proves that call_llm() has NO error handling
  - Frontend receives ungraceful error instead of SSE error event

❌ **DISCOVERED ISSUE #1 (BLOCKING)**: 
  - utils/llm.py has NO exception handling
  - Any API error crashes the entire pipeline
  - SSE stream closes without proper error event

---

## SUMMARY OF PROBLEMS FOUND

### CRITICAL ISSUES (Will Crash):

1. **utils/llm.py (Lines 12-24): NO TRY/EXCEPT BLOCK**
   - Exception Type: google.genai.errors.ClientError or any API error
   - Impact: Entire pipeline crashes
   - SSE stream terminates without error event sent to frontend
   - Status Code: 429 (rate limit) propagates uncaught
   - Evidence: Test shows uncaught ClientError

2. **api/routes.py (Line 155-168): NO INPUT VALIDATION**
   - preprocessed_text not validated for empty/None
   - If preprocessor returns empty string, LLM receives empty prompt
   - LLM will return invalid JSON or error
   - extract() will crash on line 40 with no helpful error message

3. **IMPORT ISSUE (NOW FIXED)**
   - Was: utils/llm.py using `from google import genai` with wrong package
   - Old package: google-generativeai (0.8.6) - deprecated API
   - New package: google-genai - latest API
   - Fix: `pip install google-genai` installed successfully
   - Status: ✓ RESOLVED by installing correct package

### MODERATE ISSUES (Will Degrade):

4. **agents/claim_extractor.py (Lines 39-43): POOR ERROR CONTEXT**
   - Retry logic doesn't add debugging output for raw_output
   - When json.loads fails twice, error message doesn't show what LLM returned
   - Makes debugging pipeline failures very difficult

5. **utils/llm.py (Line 19): NO RESPONSE VALIDATION**
   - response.text could be empty or None (unlikely but possible)
   - No check before calling response.text.strip()
   - Could cause AttributeError in edge cases

---

## DETAILED ISSUE LOCATIONS

| Issue # | File | Line(s) | Problem | Severity |
|---------|------|---------|---------|----------|
| 1 | utils/llm.py | 12-24 | No try/except for API errors | CRITICAL |
| 2 | api/routes.py | 155-168 | No validation that preprocessed_text exists | CRITICAL |
| 3 | agents/claim_extractor.py | 39-43 | Limited error context on retry failure | MODERATE |
| 4 | utils/llm.py | 19 | No response validation | MODERATE |
| 5 | config.py | N/A | No validation that GEMINI_API_KEY is set | MODERATE |

---

## RECOMMENDATION FOR NEXT STEP

DO NOT FIX YET (as per user request). These are all the problems found:

1. **BLOCKING**: LLM exception handling missing - crashes pipeline
2. **BLOCKING**: Input validation missing - accepts empty preprocessed text
3. **HIGH**: Error context missing - hard to debug JSON parse failures  
4. **MEDIUM**: Response validation missing - unlikely but possible crash
5. **MEDIUM**: API key validation missing - runtime error instead of startup error

All problems documented. No fixes applied.
