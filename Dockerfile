# Build stage
FROM node:18.17-alpine as builder

# Set working directory
WORKDIR /app

# Install dependencies first (better cache utilization)
COPY package*.json ./
COPY bun.lockb ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy custom nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Add nginx configuration for React routing
RUN echo '                                            \
server {                                             \
    listen 80;                                       \
    location / {                                     \
        root /usr/share/nginx/html;                  \
        index index.html;                            \
        try_files $uri $uri/ /index.html;            \
    }                                               \
}' > /etc/nginx/conf.d/default.conf

# Switch to non-root user
RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -g 'appuser' -s /bin/sh -D appuser && \
    chown -R appuser:appgroup /usr/share/nginx/html

USER appuser

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]