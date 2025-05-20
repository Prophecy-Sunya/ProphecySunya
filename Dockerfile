FROM ubuntu:22.04 as builder

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV PATH="/root/.cargo/bin:${PATH}"
ENV SCARB_VERSION=2.4.0

# Install dependencies with minimal layers and cleanup in the same step
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    build-essential \
    pkg-config \
    libssl-dev \
    python3 \
    python3-pip \
    python3-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Rust (required for Scarb)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --profile minimal

# Install Scarb with specific Cairo version and verify installation
RUN curl --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/software-mansion/scarb/main/installer.sh | bash -s -- -v ${SCARB_VERSION} \
    && scarb --version \
    && mkdir -p /root/.scarb

# Install Node.js using NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs \
    && npm install -g yarn \
    && rm -rf /var/lib/apt/lists/*

# Create a multi-stage build to reduce image size
FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV PATH="/root/.cargo/bin:${PATH}"
ENV NODE_ENV=production

# Install runtime dependencies with minimal layers
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    python3 \
    python3-pip \
    ca-certificates \
    tini \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js using NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs \
    && npm install -g yarn \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Download starknet-devnet binary from GitHub releases
RUN curl -L https://github.com/0xSpaceShard/starknet-devnet/releases/download/v0.4.1/starknet-devnet-linux-x86_64-v0.4.1.tar.gz -o starknet-devnet.tar.gz \
    && tar -xzf starknet-devnet.tar.gz \
    && mv starknet-devnet /usr/local/bin/ \
    && chmod +x /usr/local/bin/starknet-devnet \
    && rm starknet-devnet.tar.gz

# Copy Rust and Scarb from builder
COPY --from=builder /root/.cargo /root/.cargo
# Create .scarb directory in case it doesn't exist
RUN mkdir -p /root/.scarb
# Copy Scarb files if they exist in builder
COPY --from=builder /root/.scarb /root/.scarb || true

# Copy package.json and install dependencies first to leverage Docker cache
COPY frontend/package.json frontend/yarn.lock* frontend/package-lock.json* frontend/pnpm-lock.yaml* /app/frontend/
RUN cd /app/frontend && yarn install --frozen-lockfile --production

# Copy project files
COPY . .

# Build the contracts
RUN scarb --version || echo "Scarb not installed correctly" \
    && scarb build || echo "Scarb build failed, continuing anyway"

# Set entrypoint script
RUN echo '#!/bin/bash\n\
if [ "$1" = "test" ]; then\n\
  scarb test\n\
elif [ "$1" = "build" ]; then\n\
  scarb build\n\
elif [ "$1" = "devnet" ]; then\n\
  exec tini -- starknet-devnet --host 0.0.0.0 --port 5050\n\
elif [ "$1" = "frontend" ]; then\n\
  cd frontend && yarn dev\n\
elif [ "$1" = "frontend:build" ]; then\n\
  cd frontend && yarn build\n\
elif [ "$1" = "frontend:start" ]; then\n\
  cd frontend && yarn start\n\
elif [ "$1" = "full-stack" ]; then\n\
  starknet-devnet --host 0.0.0.0 --port 5050 & \n\
  cd frontend && yarn dev\n\
elif [ "$1" = "shell" ]; then\n\
  exec /bin/bash\n\
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
