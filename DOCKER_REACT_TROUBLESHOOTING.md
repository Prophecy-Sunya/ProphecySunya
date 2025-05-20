# Docker and React Troubleshooting Guide

This document provides guidance on resolving common Docker and React issues in the ProphecySunya project.

## Docker Build Context Issues

### Common Problems

1. **Large Build Context**: Including node_modules in the build context can lead to:
   - Slow build times due to transferring hundreds of megabytes
   - File permission errors during context transfer
   - "Unknown file mode" errors with symlinks

2. **Permission Issues**: Symlinks and executable files in node_modules can cause:
   - `failed to checksum file` errors
   - `unknown file mode` errors
   - Context transfer failures

### Solutions

1. **Use .dockerignore**: Create a comprehensive .dockerignore file that excludes:
   - node_modules directories
   - Build outputs (.next, dist, etc.)
   - Development files (.git, .vscode, etc.)
   - Temporary files and logs

2. **Clean Installation**: Install dependencies inside the container:
   - Copy only package.json first
   - Run yarn/npm install inside the container
   - This ensures consistent dependencies across environments

3. **Avoid Volume Mounting node_modules**: When using Docker Compose:
   - Mount only source directories, not node_modules
   - This prevents duplicate dependencies and permission issues

4. **Yarn Commands**: Be aware of Yarn version differences:
   - Yarn v1 `install` already handles deduplication automatically
   - Avoid using `yarn dedupe` with Yarn v1 as it's not supported
   - Use `--frozen-lockfile` for consistent installations

## React Hooks Issues

### Common Problems

1. **Invalid Hook Call Errors**: These typically occur due to:
   - Multiple React instances in the application
   - Mismatched versions of React and React DOM
   - Breaking Rules of Hooks (using hooks conditionally)

2. **Docker-specific Issues**:
   - Volume mounting can cause duplicate React instances
   - Development/production environment mismatches
   - Module resolution problems with symlinks

### Solutions

1. **Enforce Single React Instance**:
   - Use exact versions in package.json (remove ^ and ~ prefixes)
   - Add resolutions field to enforce specific versions
   - Let Yarn handle deduplication during install

2. **Proper Module Resolution**:
   - Use NODE_OPTIONS="--preserve-symlinks" for proper module resolution
   - Increase memory limits with --max-old-space-size if needed
   - Ensure consistent NODE_ENV across development and production

3. **Clean Development Environment**:
   - Periodically clean node_modules and reinstall
   - Use tools like duplicate-package-checker-webpack-plugin
   - Consider using npm/yarn workspaces for monorepos

## Best Practices for ProphecySunya

1. **Docker Build Efficiency**:
   - Use .dockerignore to exclude unnecessary files
   - Leverage build cache with proper layer ordering
   - Use multi-stage builds to reduce image size

2. **React Dependency Management**:
   - Pin exact versions for React and React DOM
   - Use resolutions to enforce consistent versions
   - Regularly audit and update dependencies

3. **Development Workflow**:
   - Rebuild Docker image when changing dependencies
   - Use selective volume mounting for source files only
   - Consider using Docker for production builds only

## Additional Resources

- [Docker Build Context Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [React Hooks Rules](https://reactjs.org/docs/hooks-rules.html)
- [Yarn Resolutions](https://classic.yarnpkg.com/lang/en/docs/selective-version-resolutions/)
