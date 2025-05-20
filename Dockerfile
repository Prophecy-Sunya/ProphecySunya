FROM ubuntu:22.04 as builder

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV PATH="/root/.cargo/bin:${PATH}"
ENV SCARB_VERSION=2.4.0

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    pkg-config \
    libssl-dev \
    python3 \
    python3-pip \
    python3-dev \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Install Rust (required for Scarb)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Install Scarb with specific Cairo version
RUN curl --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/software-mansion/scarb/main/installer.sh | bash -s -- -v ${SCARB_VERSION}

# Set up Node.js environment
RUN npm install -g n && n stable
RUN npm install -g yarn

# Create a multi-stage build to reduce image size
FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV PATH="/root/.cargo/bin:${PATH}"
ENV NODE_ENV=production

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    curl \
    python3 \
    python3-pip \
    nodejs \
    npm \
    ca-certificates \
    tini \
    && rm -rf /var/lib/apt/lists/*

# Install Rust and Scarb
COPY --from=builder /root/.cargo /root/.cargo
COPY --from=builder /root/.scarb /root/.scarb

# Set up Node.js environment
RUN npm install -g n && n stable
RUN npm install -g yarn next

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Build the contracts
RUN scarb build

# Download starknet-devnet binary from GitHub releases
RUN curl -L https://github.com/0xSpaceShard/starknet-devnet/releases/download/v0.4.1/starknet-devnet-linux-x86_64-v0.4.1.tar.gz -o starknet-devnet.tar.gz \
    && tar -xzf starknet-devnet.tar.gz \
    && mv starknet-devnet /usr/local/bin/ \
    && chmod +x /usr/local/bin/starknet-devnet \
    && rm starknet-devnet.tar.gz

# Set entrypoint script
RUN echo '#!/bin/bash\n\
if [ "$1" = "test" ]; then\n\
  scarb test\n\
elif [ "$1" = "build" ]; then\n\
  scarb build\n\
elif [ "$1" = "devnet" ]; then\n\
  starknet-devnet --host 0.0.0.0 --port 5050\n\
elif [ "$1" = "frontend" ]; then\n\
  cd frontend && yarn && yarn dev\n\
elif [ "$1" = "frontend:build" ]; then\n\
  cd frontend && yarn && yarn build\n\
elif [ "$1" = "frontend:start" ]; then\n\
  cd frontend && yarn && yarn start\n\
elif [ "$1" = "full-stack" ]; then\n\
  starknet-devnet --host 0.0.0.0 --port 5050 & \n\
  cd frontend && yarn && yarn dev\n\
elif [ "$1" = "shell" ]; then\n\
  /bin/bash\n\
else\n\
  echo "Usage: docker run [OPTIONS] IMAGE [COMMAND]"\n\
  echo "Commands:"\n\
  echo "  test           - Run contract tests"\n\
  echo "  build          - Build contracts"\n\
  echo "  devnet         - Start Starknet Devnet"\n\
  echo "  frontend       - Start Next.js development server"\n\
  echo "  frontend:build - Build Next.js production bundle"\n\
  echo "  frontend:start - Start Next.js production server"\n\
  echo "  full-stack     - Start both Devnet and Next.js dev server"\n\
  echo "  shell          - Start a bash shell"\n\
fi' > /entrypoint.sh && chmod +x /entrypoint.sh

# Expose ports for Starknet Devnet and Next.js
EXPOSE 5050 3000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["shell"]
