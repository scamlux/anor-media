from __future__ import annotations

from app.schemas.contracts import GeneratePlanRequest, GeneratePostRequest


def build_plan_prompt(payload: GeneratePlanRequest) -> str:
    return f"""
SYSTEM: Return STRICT JSON only. No markdown. No commentary.
MODE: CONTENT_PLAN

Generate {payload.period_days} days of financial content topics for a banking brand.
Campaign type: {payload.campaign_type}
Tone: {payload.brand_context.tone}
Audience: {payload.brand_context.audience}
Compliance notes: {payload.brand_context.compliance_notes}
Allowed emojis: {payload.brand_context.allowed_emojis}
Compliance mode: {payload.compliance_mode}

JSON schema:
{{
  "topics": [
    {{
      "date": "YYYY-MM-DD",
      "topic": "string",
      "goal": "string",
      "format": "text|image|video"
    }}
  ]
}}
""".strip()


def build_post_prompt(payload: GeneratePostRequest) -> str:
    return f"""
SYSTEM: Return STRICT JSON only. No markdown. No commentary.
MODE: POST

Create a banking social post.
Date: {payload.topic.date}
Topic: {payload.topic.topic}
Goal: {payload.topic.goal}
Requested format: {payload.format_type}
Additional comments: {payload.additional_comments}
Tone: {payload.brand_context.tone}
Audience: {payload.brand_context.audience}
Compliance notes: {payload.brand_context.compliance_notes}
Allowed emojis: {payload.brand_context.allowed_emojis}
Strict numbers mode: {payload.strict_numbers_mode}
Compliance mode: {payload.compliance_mode}

Rules:
- No markdown unless specifically requested.
- No emojis unless allowed.
- Include financial disclaimer if financial claim exists.

JSON schema:
{{
  "hook": "string",
  "main_text": "string",
  "cta": "string",
  "hashtags": ["string"],
  "visual_prompt": "string"
}}
""".strip()
