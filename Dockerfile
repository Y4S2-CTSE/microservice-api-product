FROM node:23-alpine

# Add package for better security
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies including devDependencies for development
RUN npm install

# Add Snyk CLI for container scanning
RUN npm install -g snyk

# Run Snyk container scan
RUN snyk container test node:23-alpine --severity-threshold=high || true

# Copy application code
COPY . .

# Use non-root user for security
USER node

EXPOSE 5002

# Use dumb-init as entrypoint
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "dev"]