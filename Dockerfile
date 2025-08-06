# Base image for all apps
FROM node:18-alpine AS base

# Install turbo
RUN npm install -g turbo

# Set working directory
WORKDIR /app

# Copy root files
COPY package.json package-lock.json turbo.json ./
COPY packages packages
COPY apps apps

# Install all dependencies
RUN npm ci

# Build all packages
RUN turbo run build --filter=@gomath/packages/*

# Production API image
FROM base AS api-production
WORKDIR /app

# Copy built packages and API app
COPY --from=base /app/packages ./packages
COPY --from=base /app/apps/api ./apps/api

# Install only production dependencies for API
WORKDIR /app/apps/api
RUN npm ci --only=production && npm cache clean --force

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
USER nextjs

EXPOSE 3001
CMD ["npm", "start"]

# Development API image
FROM base AS api-development
WORKDIR /app/apps/api

# Install nodemon for development
RUN npm install -g nodemon

EXPOSE 3001
CMD ["npm", "run", "dev"]

# Production Web image  
FROM base AS web-production
WORKDIR /app

# Copy built packages and web app
COPY --from=base /app/packages ./packages
COPY --from=base /app/apps/web ./apps/web

# Build web app
WORKDIR /app/apps/web
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of .next directory
RUN chown -R nextjs:nodejs .next

USER nextjs

EXPOSE 3000
CMD ["npm", "start"]

# Development Web image
FROM base AS web-development
WORKDIR /app/apps/web

EXPOSE 3000
CMD ["npm", "run", "dev"]