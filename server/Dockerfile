# Production Dockerfile for e-Haat Backend
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

# Install dependencies first for optimal layer caching
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy source files
COPY src ./src

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
