# Build stage
FROM node:18-slim AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Production stage
FROM node:18-slim

# Add dumb-init for proper process handling
RUN apt-get update && apt-get install -y dumb-init

WORKDIR /app

# Copy built node modules and source code
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Use non-root user for security
USER node

EXPOSE 5002

# Use dumb-init as entrypoint
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "dev"]