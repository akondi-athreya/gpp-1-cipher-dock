FROM node:20-slim

RUN apt-get update && apt-get install -y curl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Ensure container has /data directory
RUN mkdir -p /data

CMD ["sleep", "infinity"]