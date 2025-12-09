###############################################
# Stage 1: Builder
###############################################
FROM node:20-slim AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies (production only)
RUN npm install --omit=dev

# Copy full application source
COPY . .

###############################################
# Stage 2: Runtime
###############################################
FROM node:20-slim AS runtime

# Set timezone to UTC (required)
ENV TZ=UTC

WORKDIR /app

# Install cron + timezone data
RUN apt-get update && \
    apt-get install -y cron tzdata curl && \
    rm -rf /var/lib/apt/lists/*

# Configure timezone
RUN ln -snf /usr/share/zoneinfo/UTC /etc/localtime && echo "UTC" > /etc/timezone

# Copy built app from builder
COPY --from=builder /app /app

# Create mount points
RUN mkdir -p /data && chmod 755 /data
RUN mkdir -p /cron && chmod 755 /cron

# Heartbeat cron job
COPY cronjob.txt /etc/cron.d/app-cron
RUN chmod 0644 /etc/cron.d/app-cron

# TOTP logging cron job
COPY cron/2fa-cron /etc/cron.d/2fa-cron
RUN chmod 0644 /etc/cron.d/2fa-cron

# Expose required port
EXPOSE 8080

# Start cron and API server
CMD ["sh", "-c", "cron -f & exec node /app/src/app.js"]