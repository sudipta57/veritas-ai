from google import genai
from google.genai import types

from config import GEMINI_API_KEY


client = genai.Client(api_key=GEMINI_API_KEY)


async def call_llm(system_prompt: str, user_prompt: str) -> str:
	full_prompt = f"{system_prompt}\n\n{user_prompt}"
	response = await client.aio.models.generate_content(
		model="gemini-2.5-flash",
		contents=full_prompt,
		config=types.GenerateContentConfig(
			temperature=0.1,
			max_output_tokens=4096,
		),
	)
	return response.text.strip()
