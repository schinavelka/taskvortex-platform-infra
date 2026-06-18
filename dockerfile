# ==========================================
# Stage 1: Build & Dependency Installation
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install ALL dependencies
RUN npm ci

# Copy the rest of the application source (including the src directory)
COPY . .

# ==========================================
# Stage 2: Final Production Runtime
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy package files to install ONLY production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application files and the src folder from the builder stage
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/src ./src

# Security Best Practice: Run as a non-privileged user
USER node

EXPOSE 3000

# Executing from the new path
CMD ["node", "src/server.js"]