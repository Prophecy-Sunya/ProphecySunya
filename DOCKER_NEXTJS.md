# Docker and Next.js Configuration Guide

This document provides guidance on configuring Docker for Next.js applications in the ProphecySunya project.

## Docker Configuration

The Dockerfile has been updated to properly support Next.js development and production environments:

1. **Development Dependencies**
   - All dependencies (including devDependencies) are installed with `yarn install --frozen-lockfile --production=false`
   - NODE_ENV is not set to "production" in the container to ensure all dependencies are available

2. **Next.js Binary**
   - Next.js is installed globally with `npm install -g next` to ensure the binary is available in PATH
   - This ensures that commands like `next dev` and `next start` work properly

3. **Volume Mounting**
   - The docker-compose.yml mounts the frontend directory as a volume for live code reloading
   - This allows for development without rebuilding the container

## Running the Application

To run the application:

```bash
docker-compose up
```

This will:
1. Build the Docker image if needed
2. Start the frontend service
3. Make the application available at http://localhost:3000

## Production Deployment

For production deployment:

1. Build the production bundle:
```bash
docker-compose run --rm frontend frontend:build
```

2. Start the production server:
```bash
docker-compose run -e NODE_ENV=production frontend frontend:start
```

## Troubleshooting

If you encounter issues with missing dependencies:

1. Ensure the package is listed in package.json (not just in devDependencies if needed for production)
2. Rebuild the Docker image with `docker-compose build --no-cache`
3. Check container logs with `docker-compose logs frontend`
