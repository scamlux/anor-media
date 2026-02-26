from __future__ import annotations

from dataclasses import dataclass


@dataclass
class ProviderResult:
    provider: str
    text: str
    cost_usd: float


class ProviderError(Exception):
    pass


class BaseProvider:
    name: str

    async def complete(self, prompt: str) -> ProviderResult:
        raise NotImplementedError
