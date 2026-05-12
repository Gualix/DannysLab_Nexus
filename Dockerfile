# Plain Node SSR build for TanStack Start (no Cloudflare).

# Stage 1: Builder — installs deps & runs the production build.
FROM node:22-slim AS builder

WORKDIR /app

# Ensure plugin-react emits the production JSX runtime (jsx, not jsxDEV).
ENV NODE_ENV=production

COPY package.json package-lock.json* ./
# Install incl. devDependencies (vite, plugins) even with NODE_ENV=production.
RUN npm install --include=dev --no-audit --no-fund

COPY . .
RUN npm run build

# Stage 2: Production deps — slim install of only runtime deps (srvx).
FROM node:22-slim AS prod-deps

WORKDIR /app

COPY package.json package-lock.json* ./
# Install only what server.mjs needs at runtime.
RUN npm install --omit=dev --no-audit --no-fund srvx@^0.11

# Stage 3: Runtime
FROM node:22-slim AS runtime

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends dumb-init curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Built output, server entry, and production deps
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.mjs ./server.mjs
COPY --from=builder /app/package.json ./package.json
COPY --from=prod-deps /app/node_modules ./node_modules

# Non-root user
RUN groupadd -r nodeapp && useradd -r -g nodeapp -d /app nodeapp \
    && chown -R nodeapp:nodeapp /app
USER nodeapp

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -fsS http://localhost:3000/api/health -o /dev/null || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.mjs"]
