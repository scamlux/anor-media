# Folder Structure

```text
anor-media/
  apps/
    frontend/                  # Next.js App Router
      app/
      components/
      features/
      hooks/
      services/
      store/
      types/
      utils/
    backend/                   # Express API + Worker
      src/
        config/
        constants/
        db/
          migrations/
        middleware/
        modules/
          auth/
          projects/
          brand-brain/
          plans/
          posts/
          approvals/
          logs/
        queues/
        services/
        utils/
    ai-orchestrator/           # Python FastAPI AI layer
      app/
        api/
        core/
        providers/
        schemas/
        services/
  packages/
    shared/
      src/
        schemas/
        types/
  infra/
    backup/
    nginx/
    monitoring/
  docs/
  docker-compose.yml
  .env.example
  README.md
```
