# Use Node.js LTS version (slim for smaller image size)
FROM node:20-slim

# Install openssl for Prisma and other essentials
RUN apt-get update -y && apt-get install -y openssl

# Create app directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install only production dependencies
# Note: For this demo we install all as there are few
RUN npm install

# Copy the rest of the application
COPY . .

# Create a directory for persistent data (SQLite)
RUN mkdir -p /app/prisma/data && chmod 777 /app/prisma/data

# Generate Prisma Client
RUN npx prisma generate

# Final setup: 
# 1. Run migrations to ensure DB schema is up to date
# 2. Start the server
EXPOSE 3000

# Using 'prisma migrate deploy' is better for production, 
# but we'll use 'dev' here to auto-create DB if missing for your first Easypanel run.
CMD ["sh", "-c", "npx prisma migrate dev --name deploy && npm start"]
