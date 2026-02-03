FROM node:18-alpine
WORKDIR /app

# Copy package metadata and install dependencies
COPY backend/package*.json ./
RUN npm ci --production || npm install --production

# Copy backend source
COPY backend/ ./

EXPOSE 8080
CMD ["node", "server.js"]
