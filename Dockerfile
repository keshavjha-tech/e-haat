# Production Dockerfile for e-Haat Backend (Root context for Cloud / Render)
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

# Install backend dependencies first for optimal layer caching
COPY server/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy backend source files
COPY server/src ./src

# Create non-root user and change ownership
RUN chown -R node:node /app
USER node

# Expose backend port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Start the server
CMD ["node", "src/index.js"]
