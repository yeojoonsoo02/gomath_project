# API 전용 Dockerfile (더 빠른 빌드를 위해)
FROM node:18-alpine AS base

# Install turbo
RUN npm install -g turbo

WORKDIR /app

# Copy root dependency files
COPY package.json package-lock.json turbo.json ./

# Copy packages and API
COPY packages ./packages
COPY apps/api ./apps/api

# Install dependencies
RUN npm ci

# Build shared packages
RUN turbo run build --filter=@gomath/shared --filter=@gomath/ui

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy built packages
COPY --from=base /app/packages/shared/dist ./node_modules/@gomath/shared
COPY --from=base /app/packages/shared/package.json ./node_modules/@gomath/shared/

# Copy API files
COPY --from=base /app/apps/api ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S apiuser -u 1001

# Set proper permissions
RUN chown -R apiuser:nodejs /app
USER apiuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

EXPOSE 3001

CMD ["node", "dist/main.js"]