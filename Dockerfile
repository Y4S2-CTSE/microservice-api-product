# Build stage
FROM node:18-slim AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Production stage
FROM node:18-slim

WORKDIR /app

# Define build arguments
ARG MONGO_URI
ARG PORT=5002
ARG JWT_SECRET

# Set environment variables
ENV NODE_ENV=production
ENV PORT=$PORT
ENV MONGO_URI=$MONGO_URI
ENV JWT_SECRET=$JWT_SECRET

# Copy built node modules and source code
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Use non-root user for security
USER node

EXPOSE $PORT

CMD ["npm", "run", "start"]