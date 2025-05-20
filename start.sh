#!/bin/bash

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker and Docker Compose are required to run this project."
    echo "Please install Docker and Docker Compose before continuing."
    exit 1
fi

# Check if the .env.local file exists in the frontend directory
if [ ! -f "./frontend/.env.local" ]; then
    echo "Creating .env.local file for frontend..."
    cat > ./frontend/.env.local << EOL
NEXT_PUBLIC_STARKNET_NETWORK=devnet
NEXT_PUBLIC_DEVNET_URL=http://localhost:5050
EOL
fi

# Make the deploy-contracts.sh executable
chmod +x deploy-contracts.sh

# Display startup message
echo "====================================================="
echo "  Starting ProphecySunya Full-Stack Environment"
echo "====================================================="
echo ""
echo "This will start:"
echo "  1. Starknet Devnet (http://localhost:5050)"
echo "  2. Contract Deployer (automatic deployment to Devnet)"
echo "  3. Next.js Frontend (http://localhost:3000)"
echo ""
echo "Starting services with Docker Compose..."

# Start all services with docker-compose
docker-compose up -d

# Wait for services to start
echo ""
echo "Services are starting up..."
echo "This may take a minute or two for all components to initialize."
echo ""
echo "You can view logs with: docker-compose logs -f"
echo "To stop all services: docker-compose down"
echo ""
echo "====================================================="
echo "  ProphecySunya is ready at: http://localhost:3000"
echo "  Starknet Devnet is at: http://localhost:5050"
echo "====================================================="
