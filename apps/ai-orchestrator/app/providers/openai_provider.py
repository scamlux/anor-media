from __future__ import annotations

import httpx

from app.core.config import settings

from .base import BaseProvider, ProviderError, ProviderResult


class OpenAIProvider(BaseProvider):
    name = "openai"

    async def complete(self, prompt: str) -> ProviderResult:
        if not settings.openai_api_key:
            raise ProviderError("OPENAI_API_KEY is missing")

        headers = {
            "Authorization": f"Bearer {settings.openai_api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": settings.openai_model,
            "input": prompt,
            "temperature": 0.2,
        }

        async with httpx.AsyncClient(timeout=90.0) as client:
            response = await client.post("https://api.openai.com/v1/responses", headers=headers, json=payload)

        if response.status_code >= 400:
            raise ProviderError(f"OpenAI provider failed: {response.status_code} {response.text}")

        data = response.json()
        output = data.get("output", [])
        text_parts: list[str] = []
        for item in output:
            for content in item.get("content", []):
                if content.get("type") == "output_text":
                    text_parts.append(content.get("text", ""))

        text = "\n".join(part for part in text_parts if part).strip()
        if not text:
            raise ProviderError("OpenAI provider returned empty response")

        usage = data.get("usage", {})
        input_tokens = int(usage.get("input_tokens", 0))
        output_tokens = int(usage.get("output_tokens", 0))

        # Conservative estimate for gpt-4.1-mini cost (placeholder for local tracking)
        cost = (input_tokens * 0.0000004) + (output_tokens * 0.0000016)

        return ProviderResult(provider=self.name, text=text, cost_usd=round(cost, 6))
