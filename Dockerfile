FROM node:18-alpine

# Add package for better security
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Use non-root user for security
USER node

EXPOSE 5002

# Use dumb-init as entrypoint
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]