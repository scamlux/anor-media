FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json ./
COPY apps/frontend/package.json ./apps/frontend/package.json
COPY packages/shared/package.json ./packages/shared/package.json
RUN npm install

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build --workspace @anor/shared && npm run build --workspace @anor/frontend

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/apps/frontend/package.json ./apps/frontend/package.json
COPY --from=builder /app/apps/frontend/next.config.ts ./apps/frontend/next.config.ts
COPY --from=builder /app/apps/frontend/tsconfig.json ./apps/frontend/tsconfig.json
CMD ["node_modules/.bin/next", "start", "apps/frontend", "-p", "3000"]
