# ---------------------------
# Build stage
# ---------------------------
FROM node:20-alpine AS builder

WORKDIR /build

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source code
COPY . .

# Build the React Vite app
# Use environment variable for API base URL
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# ---------------------------
# Runtime stage
# ---------------------------
FROM node:20-alpine

WORKDIR /app

# Install serve to serve the static files
RUN npm install -g serve

# Copy the built files from the build stage
COPY --from=builder /build/dist ./dist

# Expose port
EXPOSE 5173

# Serve the frontend
CMD ["serve", "-s", "dist", "-l", "5173"]