from __future__ import annotations

from fastapi import APIRouter, Depends, Header, HTTPException

from app.core.config import settings
from app.schemas.contracts import (
    GeneratePlanRequest,
    GeneratePlanResponse,
    GeneratePostRequest,
    GeneratePostResponse,
)
from app.services.orchestrator import generate_plan, generate_post

router = APIRouter()


def authorize(x_api_key: str = Header(default="")) -> None:
    if x_api_key != settings.api_key:
        raise HTTPException(status_code=401, detail="Unauthorized")


@router.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/generate-plan", response_model=GeneratePlanResponse, dependencies=[Depends(authorize)])
async def generate_plan_endpoint(payload: GeneratePlanRequest) -> GeneratePlanResponse:
    return await generate_plan(payload)


@router.post("/generate-post", response_model=GeneratePostResponse, dependencies=[Depends(authorize)])
async def generate_post_endpoint(payload: GeneratePostRequest) -> GeneratePostResponse:
    return await generate_post(payload)
