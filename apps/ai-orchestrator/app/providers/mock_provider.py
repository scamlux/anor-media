from __future__ import annotations

import json
import re
from datetime import date, timedelta

from .base import BaseProvider, ProviderResult


class MockProvider(BaseProvider):
    name = "mock"

    async def complete(self, prompt: str) -> ProviderResult:
        if "CONTENT_PLAN" in prompt:
            today = date.today()
            topics = []
            for idx in range(30):
                day = today + timedelta(days=idx)
                topics.append(
                    {
                        "date": day.isoformat(),
                        "topic": f"Banking insight day {idx + 1}",
                        "goal": "conversion" if idx % 2 == 0 else "education",
                        "format": "text" if idx % 3 else "image",
                    }
                )
            return ProviderResult(provider=self.name, text=json.dumps({"topics": topics}), cost_usd=0.11)

        matches = re.findall(r"(?<!\w)(?:\d+(?:\.\d+)?%?|\d+(?:\.\d+)?)(?!\w)", prompt)
        numeric_snippet = ", ".join(matches) if matches else "approved values"
        content = {
            "hook": "Secure savings starts with clear strategy.",
            "main_text": f"Build a disciplined plan to grow deposits using {numeric_snippet} with transparent terms.",
            "cta": "Talk to your relationship manager today.",
            "hashtags": ["#Banking", "#Savings", "#FinancialPlanning"],
            "visual_prompt": "Professional bank advisor discussing savings options in modern branch",
        }
        return ProviderResult(provider=self.name, text=json.dumps(content), cost_usd=0.13)
