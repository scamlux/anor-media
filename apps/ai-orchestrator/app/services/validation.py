from __future__ import annotations

import json
import re
from typing import Any

from jsonschema import validate as jsonschema_validate
from jsonschema.exceptions import ValidationError

from app.schemas.json_schema import CONTENT_PLAN_JSON_SCHEMA, POST_JSON_SCHEMA

NUMBER_REGEX = re.compile(r"(?<!\w)(?:\d+(?:\.\d+)?%?|\d+(?:\.\d+)?)(?!\w)")
EMOJI_REGEX = re.compile(
    "["
    "\U0001F300-\U0001F5FF"
    "\U0001F600-\U0001F64F"
    "\U0001F680-\U0001F6FF"
    "\U0001F700-\U0001F77F"
    "\U0001F900-\U0001F9FF"
    "]+",
    flags=re.UNICODE,
)


class StrictValidationError(Exception):
    pass


def extract_json(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?", "", cleaned).strip()
        cleaned = re.sub(r"```$", "", cleaned).strip()

    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise StrictValidationError("No JSON object found")

    fragment = cleaned[start : end + 1]
    try:
        return json.loads(fragment)
    except json.JSONDecodeError as exc:
        raise StrictValidationError(f"JSON parse failed: {exc}") from exc


def validate_plan_payload(payload: dict[str, Any]) -> dict[str, Any]:
    try:
        jsonschema_validate(instance=payload, schema=CONTENT_PLAN_JSON_SCHEMA)
    except ValidationError as exc:
        raise StrictValidationError(f"Plan schema validation failed: {exc.message}") from exc
    return payload


def validate_post_payload(payload: dict[str, Any]) -> dict[str, Any]:
    try:
        jsonschema_validate(instance=payload, schema=POST_JSON_SCHEMA)
    except ValidationError as exc:
        raise StrictValidationError(f"Post schema validation failed: {exc.message}") from exc
    return payload


def enforce_strict_numbers(additional_comments: str, generated_text: str) -> None:
    expected = NUMBER_REGEX.findall(additional_comments)
    if not expected:
        return

    generated = set(NUMBER_REGEX.findall(generated_text))
    missing = [value for value in expected if value not in generated]
    if missing:
        raise StrictValidationError(f"Strict number validation failed. Missing values: {missing}")


def enforce_post_rules(payload: dict[str, Any], *, allowed_emojis: bool) -> None:
    text_fields = [payload.get("hook", ""), payload.get("main_text", ""), payload.get("cta", "")]
    merged = " ".join(text_fields)

    if "```" in merged:
        raise StrictValidationError("Markdown output is not allowed")

    if not allowed_emojis and EMOJI_REGEX.search(merged):
        raise StrictValidationError("Emojis are not allowed by brand context")
