FROM --platform=linux/amd64 oven/bun:alpine AS base

# Dependencies stage
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code and configuration files
COPY . .

# Build the application
RUN bun install -g @nestjs/cli && bun run build

# Production stage
FROM base AS production
RUN apk add --no-cache dumb-init


RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

WORKDIR /app
COPY package.json bun.lock ./

# Install only production dependencies
RUN bun install --frozen-lockfile --production && \
    bun pm cache rm

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/libs ./libs

RUN chown -R nestjs:nodejs /app
USER nestjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun --version || exit 1

ENTRYPOINT ["dumb-init", "--"]

CMD ["bun", "--bun", "dist/main.js"] 