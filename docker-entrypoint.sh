#!/bin/bash

if [ "$1" = "deploy" ]; then
  cd /app/scripts && npm run deploy
elif [ "$1" = "frontend" ]; then
  source /app/load-contract-addresses.sh
  cd /app/frontend && npm run dev
elif [ "$1" = "frontend:build" ]; then
  source /app/load-contract-addresses.sh
  cd /app/frontend && npm run build
elif [ "$1" = "frontend:start" ]; then
  source /app/load-contract-addresses.sh
  cd /app/frontend && npm run start
elif [ "$1" = "shell" ]; then
  exec /bin/bash
else
  echo "Usage: docker run [OPTIONS] IMAGE [COMMAND]"
  echo "Commands:"
  echo "  deploy         - Deploy contracts using TypeScript deployment script"
  echo "  frontend       - Start Next.js development server"
  echo "  frontend:build - Build Next.js production bundle"
  echo "  frontend:start - Start Next.js production server"
  echo "  shell          - Start a bash shell"
fi
