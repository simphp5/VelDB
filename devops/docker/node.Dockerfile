# syntax=docker/dockerfile:1.7

# ----------------------------------
# Stage 1: Install production deps
# ----------------------------------
FROM node:20-alpine AS deps

# Keep app files in a predictable directory.
WORKDIR /app

# Copy only package manifests first to maximize build cache reuse.
COPY api/package*.json ./

# Install only production dependencies for the final runtime image.
RUN npm ci --omit=dev

# ----------------------------------
# Stage 2: Build app artifacts
# ----------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests and install all dependencies (including dev).
COPY api/package*.json ./
RUN npm ci

# Copy source code and build when a build script exists.
COPY api/ ./
RUN npm run build --if-present

# ----------------------------------
# Stage 3: Production runtime
# ----------------------------------
FROM node:20-alpine AS runner

# Set production defaults.
ENV NODE_ENV=production \
    PORT=3000

WORKDIR /app

# Copy production dependencies and built source.
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app ./

# Run as non-root user for improved security.
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs && chown -R nodejs:nodejs /app
USER nodejs

# API public port.
EXPOSE 3000

# Start Express API (requires a start script in package.json).
CMD ["npm", "run", "start"]
