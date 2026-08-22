# ============================================================
# Riam Ensiling — Multi-stage Dockerfile
# Stage 1 (deps): install production dependencies only
# Stage 2 (builder): build the Next.js app
# Stage 3 (runner): minimal production image
# ============================================================

# ---- Stage 1: Install dependencies ----
FROM node:22-alpine AS deps
WORKDIR /app

# Copy lock files to cache the layer
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ---- Stage 2: Build ----
FROM node:22-alpine AS builder
WORKDIR /app

# Install ALL deps (including devDependencies needed for build)
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Generate Prisma client before build
RUN [ -f "prisma/schema.prisma" ] && npx prisma generate || true

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Stage 3: Runner ----
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Mount point for uploaded images (persistent volume)
RUN mkdir -p ./public/uploads && chown nextjs:nodejs ./public/uploads

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
