# ANOR MEDIA Enterprise Architecture

## 1) System Architecture Diagram (Text)

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                             Client (Browser)                              │
│        Next.js App Router + TypeScript + Tailwind + Zustand + RHF         │
└───────────────────────────────┬────────────────────────────────────────────┘
                                │ HTTPS (JWT HttpOnly Cookie)
                                ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                         API Gateway (Nginx Reverse Proxy)                  │
│  / -> Frontend, /api -> Backend, /orchestrator -> AI Orchestrator         │
└───────────────────────────────┬────────────────────────────────────────────┘
                                │
                                ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                    Backend API (Node.js + Express + TS)                    │
│  Layers: Routes -> Controllers -> Services -> Repositories -> DB           │
│  Cross-cutting: Zod Validation, RBAC, Audit Logs, Metrics, Error Handling  │
└─────────────┬───────────────────────┬───────────────────────────┬──────────┘
              │                       │                           │
              ▼                       ▼                           ▼
┌────────────────────┐      ┌────────────────────┐      ┌────────────────────┐
│ PostgreSQL         │      │ Redis + BullMQ     │      │ Logging + Metrics   │
│ Users/Projects/AI  │      │ plan/post queues   │      │ Prometheus hooks    │
│ versions/audit     │      │ worker scheduling  │      │ structured logging  │
└────────────────────┘      └─────────┬──────────┘      └────────────────────┘
                                       │
                                       ▼
                         ┌─────────────────────────────┐
                         │ Backend Worker (BullMQ)     │
                         │ Executes generation jobs     │
                         └──────────────┬──────────────┘
                                        │ HTTP
                                        ▼
                         ┌─────────────────────────────┐
                         │ AI Orchestrator (Python)    │
                         │ FastAPI + JSON schema       │
                         │ retry/backoff/fallback      │
                         │ strict numbers validation   │
                         │ cost tracking               │
                         └──────────────┬──────────────┘
                                        │
                                        ▼
                         ┌─────────────────────────────┐
                         │ LLM Provider(s)             │
                         │ Primary + Fallback          │
                         └─────────────────────────────┘
```

## 2) Primary Flows

### Generate Plan Flow

```text
Editor/Admin -> Frontend -> Backend API -> Queue(plan.generate)
-> Worker -> AI Orchestrator -> Primary LLM (fallback if needed)
-> Strict JSON validation + retries -> Backend persists plan/items
-> Audit log + generation log -> Frontend refreshes plan
```

### Generate Post Flow

```text
Editor/Admin -> Frontend -> Backend API (requires confirmed plan)
-> Queue(post.generate) -> Worker -> AI Orchestrator
-> Strict JSON validation + retries + numeric validation (strict mode)
-> Persist new post version + cost + generation log + audit log
-> Approval workflow (Admin) updates status
```

### Approval Flow

```text
Editor submits generated post -> Admin approves/rejects with note
-> Backend stores immutable version events + audit trail
```

## 3) Layering Rules

1. No business logic in UI components.
2. No direct API calls in UI components (services/hooks only).
3. No post generation allowed before plan confirmation.
4. Every mutation produces audit records.
5. AI outputs must pass schema validation before persistence.
