from __future__ import annotations

from app.core.config import settings

from .base import BaseProvider, ProviderError
from .mock_provider import MockProvider
from .openai_provider import OpenAIProvider


def get_provider(name: str) -> BaseProvider:
    if name == "openai":
        return OpenAIProvider()
    if name == "mock":
        return MockProvider()
    raise ProviderError(f"Unsupported provider: {name}")


def get_primary_and_fallback() -> tuple[BaseProvider, BaseProvider]:
    primary = get_provider(settings.primary_llm_provider)
    fallback = get_provider(settings.fallback_llm_provider)
    return primary, fallback
