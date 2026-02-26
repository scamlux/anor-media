from __future__ import annotations

import asyncio
import time
from typing import Any

from app.providers.base import ProviderError
from app.providers.factory import get_primary_and_fallback
from app.schemas.contracts import (
    GeneratePlanRequest,
    GeneratePlanResponse,
    GeneratePostRequest,
    GeneratePostResponse,
)
from app.services.prompt_builder import build_plan_prompt, build_post_prompt
from app.services.validation import (
    StrictValidationError,
    enforce_post_rules,
    enforce_strict_numbers,
    extract_json,
    validate_plan_payload,
    validate_post_payload,
)

BACKOFF_SECONDS = [2, 5, 10]


async def _run_with_retries(prompt: str, validator: Any) -> tuple[dict[str, Any], str, int, int, float]:
    primary, fallback = get_primary_and_fallback()
    attempts = 0
    start = time.perf_counter()

    for provider in (primary, fallback):
        last_error: Exception | None = None
        for delay in BACKOFF_SECONDS:
            attempts += 1
            try:
                result = await provider.complete(prompt)
                parsed = extract_json(result.text)
                validated = validator(parsed)
                latency_ms = int((time.perf_counter() - start) * 1000)
                return validated, result.provider, attempts, latency_ms, result.cost_usd
            except (ProviderError, StrictValidationError) as exc:
                last_error = exc
                await asyncio.sleep(delay)

        if last_error:
            # try next provider
            continue

    latency_ms = int((time.perf_counter() - start) * 1000)
    raise StrictValidationError(f"All providers failed after {attempts} attempts and {latency_ms}ms")


async def generate_plan(payload: GeneratePlanRequest) -> GeneratePlanResponse:
    prompt = build_plan_prompt(payload)
    validated, provider, attempts, latency_ms, cost_usd = await _run_with_retries(prompt, validate_plan_payload)

    return GeneratePlanResponse(
        provider=provider,
        attempts=attempts,
        latency_ms=latency_ms,
        cost_usd=cost_usd,
        topics=validated["topics"],
    )


async def generate_post(payload: GeneratePostRequest) -> GeneratePostResponse:
    prompt = build_post_prompt(payload)

    def post_validator(parsed: dict[str, Any]) -> dict[str, Any]:
        validated = validate_post_payload(parsed)
        enforce_post_rules(validated, allowed_emojis=payload.brand_context.allowed_emojis)
        body_text = " ".join(
            [validated["hook"], validated["main_text"], validated["cta"], " ".join(validated["hashtags"])]
        )
        if payload.strict_numbers_mode:
            enforce_strict_numbers(payload.additional_comments, body_text)
        return validated

    validated, provider, attempts, latency_ms, cost_usd = await _run_with_retries(prompt, post_validator)

    if payload.compliance_mode and "%" in payload.additional_comments:
        disclaimer = " This content is for informational purposes and is not financial advice."
        if disclaimer.strip() not in validated["main_text"]:
            validated["main_text"] = f"{validated['main_text'].rstrip()}{disclaimer}"

    media_type = "image" if "image" in payload.format_type else "video" if "video" in payload.format_type else "image"
    media = [{"type": media_type, "url": f"https://cdn.example.com/generated/{payload.project_id}/{payload.topic.date}.{ 'png' if media_type == 'image' else 'mp4' }"}]

    return GeneratePostResponse(
        provider=provider,
        attempts=attempts,
        latency_ms=latency_ms,
        cost_usd=cost_usd,
        content=validated,
        media=media,
    )
