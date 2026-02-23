# ─── Stage 1: Builder ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy full source
COPY . .

# Build Next.js app
RUN npm run build

# ─── Stage 2: Runner ──────────────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Copy package files and install only production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

# Copy built Next.js output
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Fixed: project uses next.config.ts (not next.config.js)
COPY --from=builder /app/next.config.ts ./

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]