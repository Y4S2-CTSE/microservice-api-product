# Build stage
FROM node:18-slim AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Production stage
FROM node:18-slim

WORKDIR /app

# Copy built node modules and source code
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Add environment variables
ENV NODE_ENV=production
ENV PORT=5002

# Use non-root user for security
USER node

EXPOSE 5002

CMD ["npm", "run", "start"]