CONTENT_PLAN_JSON_SCHEMA = {
    "type": "object",
    "required": ["topics"],
    "properties": {
        "topics": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["date", "topic", "goal", "format"],
                "properties": {
                    "date": {"type": "string", "pattern": r"^\\d{4}-\\d{2}-\\d{2}$"},
                    "topic": {"type": "string"},
                    "goal": {"type": "string"},
                    "format": {"type": "string", "enum": ["text", "image", "video"]},
                },
                "additionalProperties": False,
            },
        }
    },
    "additionalProperties": False,
}

POST_JSON_SCHEMA = {
    "type": "object",
    "required": ["hook", "main_text", "cta", "hashtags", "visual_prompt"],
    "properties": {
        "hook": {"type": "string"},
        "main_text": {"type": "string"},
        "cta": {"type": "string"},
        "hashtags": {"type": "array", "items": {"type": "string"}},
        "visual_prompt": {"type": "string"},
    },
    "additionalProperties": False,
}
