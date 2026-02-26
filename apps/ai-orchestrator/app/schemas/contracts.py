from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, field_validator


class BrandContext(BaseModel):
    tone: str
    audience: str
    compliance_notes: str
    allowed_emojis: bool


class PlanTopic(BaseModel):
    date: str = Field(pattern=r"^\d{4}-\d{2}-\d{2}$")
    topic: str
    goal: str
    format: Literal["text", "image", "video"]


class GeneratePlanRequest(BaseModel):
    project_id: str
    period_days: int = Field(ge=1, le=90)
    campaign_type: str
    compliance_mode: bool = True
    brand_context: BrandContext


class GeneratePlanResponse(BaseModel):
    provider: str
    attempts: int
    latency_ms: int
    cost_usd: float
    topics: list[PlanTopic]


class GeneratePostTopic(BaseModel):
    date: str = Field(pattern=r"^\d{4}-\d{2}-\d{2}$")
    topic: str
    goal: str
    format: Literal["text", "image", "video"]


class GeneratePostRequest(BaseModel):
    project_id: str
    topic: GeneratePostTopic
    format_type: str
    additional_comments: str
    strict_numbers_mode: bool
    compliance_mode: bool = True
    brand_context: BrandContext


class PostContent(BaseModel):
    hook: str
    main_text: str
    cta: str
    hashtags: list[str]
    visual_prompt: str

    @field_validator("hashtags")
    @classmethod
    def validate_hashtags(cls, value: list[str]) -> list[str]:
        if not value:
            raise ValueError("hashtags cannot be empty")
        return value


class MediaItem(BaseModel):
    type: Literal["image", "video"]
    url: str


class GeneratePostResponse(BaseModel):
    provider: str
    attempts: int
    latency_ms: int
    cost_usd: float
    content: PostContent
    media: list[MediaItem]
