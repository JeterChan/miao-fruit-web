# Backend Dockerfile for Node.js Express application
FROM node:18-alpine

# install git (for cloning models repository)
RUN apk add --no-cache git

WORKDIR /app

# Copy package files
COPY package*.json ./

# clone shared models
RUN git clone https://github.com/JeterChan/fruit-web-models.git shared/models

# Install production dependencies
RUN npm install --only=production

# Copy source code
COPY . .

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Expose port 5000
EXPOSE 5000

# Start the application
CMD ["npm", "start"]