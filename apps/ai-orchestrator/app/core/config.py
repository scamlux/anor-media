from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "ANOR AI Orchestrator"
    environment: str = Field(default="development", alias="NODE_ENV")
    api_key: str = Field(default="change_me", alias="AI_ORCHESTRATOR_API_KEY")

    primary_llm_provider: str = Field(default="openai", alias="PRIMARY_LLM_PROVIDER")
    fallback_llm_provider: str = Field(default="mock", alias="FALLBACK_LLM_PROVIDER")

    openai_api_key: str | None = Field(default=None, alias="OPENAI_API_KEY")
    openai_model: str = Field(default="gpt-4.1-mini", alias="OPENAI_MODEL")


settings = Settings()
