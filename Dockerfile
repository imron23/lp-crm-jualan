# Use Node.js LTS version (slim for smaller image size)
FROM node:20-slim

# Install openssl for Prisma and other essentials
RUN apt-get update -y && apt-get install -y openssl python3 make g++

# Create app directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Create a directory for persistent data (SQLite)
RUN mkdir -p /app/prisma/data && chmod 777 /app/prisma/data

# Environment variables
ENV DATABASE_URL="file:/app/prisma/data/prod.db"
ENV PORT=3200
ENV NODE_ENV=production

# Expose the port
EXPOSE 3200

# Start script
# Using 'prisma migrate deploy' to apply migrations
# Then starting the server
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
