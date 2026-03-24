import asyncio
import logging
from google import genai
from google.genai import types
from google.genai.errors import ClientError
from config import GEMINI_API_KEY

logger = logging.getLogger("veritasai")

client = genai.Client(api_key=GEMINI_API_KEY)

async def call_llm(system_prompt: str, user_prompt: str, retries: int = 5) -> str:
    full_prompt = f"{system_prompt}\n\n{user_prompt}"
    
    for attempt in range(retries):
        try:
            response = await client.aio.models.generate_content(
                model="gemini-2.5-flash",
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    temperature=0.1,
                    max_output_tokens=8192,
                )
            )
            
            if not response or not response.text:
                logger.warning("[LLM] Empty response on attempt %d", attempt + 1)
                await asyncio.sleep(2)
                continue
            
            logger.info("[LLM] Success — %d chars returned", len(response.text))
            return response.text.strip()
        
        except ClientError as e:
            error_str = str(e)
            logger.error("[LLM] ClientError attempt %d: %s", attempt + 1, error_str)
            
            # Only wait on genuine rate limit — check status code precisely
            if hasattr(e, 'status_code') and e.status_code == 429:
                wait = 10 * (attempt + 1)
                logger.warning("[LLM] True 429 rate limit. Waiting %ds", wait)
                await asyncio.sleep(wait)
                continue
            
            # Permission denied = bad key, no point retrying
            if hasattr(e, 'status_code') and e.status_code == 403:
                logger.error("[LLM] Permission denied — check API key")
                raise
            
            # Any other ClientError — short wait and retry
            await asyncio.sleep(2)
            continue
        
        except Exception as e:
            logger.error("[LLM] Unexpected error: %s", type(e).__name__, str(e))
            if attempt < retries - 1:
                await asyncio.sleep(2)
                continue
            raise
    
    logger.error("[LLM] All attempts failed, returning empty string")
    return ""
