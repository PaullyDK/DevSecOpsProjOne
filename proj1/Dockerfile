# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install dependencies required for building native packages if needed
# and copy package definitions first to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Set non-root user for security
USER node

# Expose default application port
EXPOSE 3000

# Start application server
CMD ["node", "server.js"]
