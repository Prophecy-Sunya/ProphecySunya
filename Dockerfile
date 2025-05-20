FROM ubuntu:22.04 as builder

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV PATH="/usr/local/bin:${PATH}"
ENV SCARB_VERSION=2.11.4

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
  wget \
  unzip \
  && rm -rf /var/lib/apt/lists/*

# Install Node.js from NodeSource repository
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
  apt-get install -y nodejs && \
  rm -rf /var/lib/apt/lists/*

# Install Rust (required for Cairo development)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --profile minimal
ENV PATH="/root/.cargo/bin:${PATH}"

# Download and install Scarb directly from GitHub releases
RUN mkdir -p /tmp/scarb && \
  cd /tmp/scarb && \
  wget -q https://github.com/software-mansion/scarb/releases/download/v${SCARB_VERSION}/scarb-v${SCARB_VERSION}-x86_64-unknown-linux-gnu.tar.gz && \
  tar -xzf scarb-v${SCARB_VERSION}-x86_64-unknown-linux-gnu.tar.gz && \
  mv scarb-v${SCARB_VERSION}-x86_64-unknown-linux-gnu /usr/local/scarb && \
  ln -s /usr/local/scarb/bin/scarb /usr/local/bin/scarb && \
  scarb --version && \
  mkdir -p /root/.scarb && \
  rm -rf /tmp/scarb

# Create a multi-stage build to reduce image size
FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV PATH="/usr/local/bin:${PATH}"
ENV PATH="/root/.cargo/bin:${PATH}"

# Install runtime dependencies with minimal layers
RUN apt-get update && apt-get install -y --no-install-recommends \
  curl \
  python3 \
  python3-pip \
  ca-certificates \
  tini \
  wget \
  git \
  && rm -rf /var/lib/apt/lists/*

# Install Node.js from NodeSource repository
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
  apt-get install -y nodejs && \
  npm install -g yarn && \
  rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Rust and Scarb from builder
COPY --from=builder /root/.cargo /root/.cargo
COPY --from=builder /usr/local/scarb /usr/local/scarb
RUN ln -s /usr/local/scarb/bin/scarb /usr/local/bin/scarb && \
  mkdir -p /root/.scarb && \
  scarb --version || echo "Scarb installation verification failed"

# Copy package.json and install dependencies first to leverage Docker cache
COPY frontend/package.json /app/frontend/

# Clean install with frozen lockfile
RUN cd /app/frontend && \
  yarn install --frozen-lockfile --network-timeout 600000

# Install next globally to ensure it's in PATH
RUN npm install -g next

# Copy project files (excluding node_modules via .dockerignore)
COPY . .

# Build the contracts
RUN scarb --version && scarb build || echo "Scarb build failed, continuing anyway"

# Set entrypoint script
RUN echo '#!/bin/bash\n\
  if [ "$1" = "test" ]; then\n\
  scarb test\n\
  elif [ "$1" = "build" ]; then\n\
  scarb build\n\
  elif [ "$1" = "frontend" ]; then\n\
  cd frontend && export NODE_OPTIONS="--preserve-symlinks --max-old-space-size=4096" && yarn dev\n\
  elif [ "$1" = "frontend:build" ]; then\n\
  cd frontend && export NODE_OPTIONS="--preserve-symlinks --max-old-space-size=4096" && yarn build\n\
  elif [ "$1" = "frontend:start" ]; then\n\
  cd frontend && export NODE_OPTIONS="--preserve-symlinks --max-old-space-size=4096" && yarn start\n\
  elif [ "$1" = "shell" ]; then\n\
  exec /bin/bash\n\
  else\n\
  echo "Usage: docker run [OPTIONS] IMAGE [COMMAND]"\n\
  echo "Commands:"\n\
  echo "  test           - Run contract tests"\n\
  echo "  build          - Build contracts"\n\
  echo "  frontend       - Start Next.js development server"\n\
  echo "  frontend:build - Build Next.js production bundle"\n\
  echo "  frontend:start - Start Next.js production server"\n\
  echo "  shell          - Start a bash shell"\n\
  fi' > /entrypoint.sh && chmod +x /entrypoint.sh

# Expose port for Next.js
EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["shell"]
