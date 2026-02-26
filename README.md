# ANOR MEDIA

Enterprise-grade AI content planning and generation platform for banking use-cases, implemented with strict architecture boundaries and compliance controls.

## 1. Architecture

See:
- [docs/ARCHITECTURE.md](/Users/muhammadumar/Desktop/anor-media/docs/ARCHITECTURE.md)
- [docs/FOLDER_STRUCTURE.md](/Users/muhammadumar/Desktop/anor-media/docs/FOLDER_STRUCTURE.md)

### Stack
- Frontend: Next.js App Router, TypeScript, Tailwind, Zustand, React Hook Form, Axios
- Backend: Node.js, Express, PostgreSQL, Redis (BullMQ), JWT HttpOnly cookies
- AI Layer: Python FastAPI orchestrator, strict JSON validation, retry + fallback provider, strict-number regex validation, cost tracking
- Infrastructure: Docker multi-service setup, Nginx, monitoring hooks, CI workflow

## 2. Core Safety Rules Implemented

- Posts cannot be generated until plan is confirmed.
- Post versions are immutable (`post_versions` table, monotonic `version`).
- AI responses are parsed and schema-validated before acceptance.
- Retry logic is enforced (3 attempts with exponential delays 2s, 5s, 10s).
- Fallback provider is used after primary-provider failure.
- Strict Numbers Mode validates numeric values from user comments via regex.
- All critical mutations are audit logged.
- Services are isolated in separate containers.
- Business logic is isolated from UI components.
- API calls are isolated in frontend services/hooks.

## 3. Folder Layout

- `apps/frontend` - Next.js App Router UI
- `apps/backend` - Express API, BullMQ producers/workers, DB migrations
- `apps/ai-orchestrator` - FastAPI orchestration and provider fallback layer
- `packages/shared` - shared domain types and validation schemas
- `infra/nginx` - reverse-proxy config
- `infra/monitoring` - Prometheus scrape hooks

## 4. Environment Variables

Copy `.env.example` to `.env` and update values.

Important keys:

- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `AI_ORCHESTRATOR_URL`
- `AI_ORCHESTRATOR_API_KEY`
- `PRIMARY_LLM_PROVIDER`
- `FALLBACK_LLM_PROVIDER`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_API_URL`

## 5. Local Development

### Prerequisites

- Node.js 22+
- Python 3.12+
- Docker + Docker Compose

### Install dependencies

```bash
npm install
```

### Run shared build first

```bash
npm run build --workspace @anor/shared
```

### Run services without Docker (multi-terminal)

```bash
# Terminal 1
npm run dev --workspace @anor/backend

# Terminal 2
npm run worker --workspace @anor/backend

# Terminal 3
cd apps/ai-orchestrator && pip install -r requirements.txt && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 4
npm run dev --workspace @anor/frontend
```

### Run migrations
```bash
npm run migrate --workspace @anor/backend
```

## 6. Docker Development

```bash
docker compose up --build
```

Service endpoints:

- Nginx gateway: `http://localhost`
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`
- AI Orchestrator: `http://localhost:8000`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3001`
- Postgres: `localhost:5432`
- Redis: `localhost:6379`

## 7. Default Seed Users

Password for all users: `Anor@12345`

- Admin: `admin@anor.media`
- Editor: `editor@anor.media`
- Viewer: `viewer@anor.media`

## 8. API Summary

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id/brand-context`
- `GET /api/projects/:projectId/brand-brain`
- `PUT /api/projects/:projectId/brand-brain`
- `POST /api/projects/:id/generate-plan`
- `POST /api/projects/:id/confirm-plan`
- `GET /api/projects/:id/plans`
- `GET /api/projects/:projectId/calendar`
- `POST /api/plan-items/:id/generate`
- `POST /api/posts/:id/submit-approval`
- `POST /api/posts/:id/approval`
- `GET /api/posts/:id/versions`
- `GET /api/projects/:projectId/logs`

## 9. Production Deployment (Containerized)

1. Set production-safe `.env` values.
2. Use managed Postgres/Redis and private networking.
3. Build/push images for `frontend`, `backend`, `backend-worker`, `ai-orchestrator`.
4. Run migrations before releasing backend traffic.
5. Put Nginx or cloud load balancer in front of services.
6. Enable TLS, secret manager integration, and centralized logs.
7. Enable external monitoring targets (Prometheus/Grafana/Sentry).
8. Schedule DB backup job with [infra/backup/backup.sh](/Users/muhammadumar/Desktop/anor-media/infra/backup/backup.sh) for daily encrypted backup retention policy.

## 10. CI Hooks

GitHub Actions workflow: [ci.yml](/Users/muhammadumar/Desktop/anor-media/.github/workflows/ci.yml)
- Installs dependencies
- Builds shared package
- Runs lint/test/build workspace scripts

## 11. Notes

- AI responses are accepted only after strict JSON schema validation.
- Strict Numbers Mode validation happens in orchestrator before response is returned.
- Version history is append-only by design.
