# React Hooks Troubleshooting Guide

This document provides guidance on resolving React hooks errors in Docker environments for the ProphecySunya project.

## Common React Hook Errors

The error `Invalid hook call` typically occurs due to:

1. **Multiple React instances** - React hooks require the same instance of React to be used throughout the application
2. **Mismatched versions** - Different versions of React and React DOM can cause hook failures
3. **Breaking Rules of Hooks** - Hooks must be called at the top level of components, not inside conditionals or loops

## Docker-specific Solutions

When running React applications in Docker, additional considerations are needed:

### 1. Prevent Duplicate Dependencies

- **Avoid volume mounting node_modules** - This can cause duplicate React instances
- **Use exact versions** in package.json instead of caret (^) or tilde (~) ranges
- **Add resolutions** to package.json to force specific versions of React

### 2. Clean Installation

- **Remove node_modules** before installing dependencies
- **Use yarn dedupe** to eliminate duplicate packages
- **Rebuild node_modules** from scratch inside the container

### 3. Runtime Configuration

- **Use NODE_OPTIONS="--preserve-symlinks"** to maintain proper module resolution
- **Increase memory limits** with --max-old-space-size if needed
- **Avoid development/production environment mismatches**

## Implementation in ProphecySunya

The following changes have been made to resolve hook errors:

1. **Updated package.json**:
   - Pinned exact versions for all dependencies
   - Added resolutions for React and React DOM

2. **Modified Dockerfile**:
   - Added clean installation with deduplication
   - Removed node_modules before copying project files
   - Added NODE_OPTIONS with preserve-symlinks

3. **Updated docker-compose.yml**:
   - Removed volume mounts to prevent dependency duplication

## Troubleshooting

If hook errors persist:

1. Check for hidden React dependencies in node_modules
2. Verify that all React-related packages use the same version
3. Inspect the dependency tree with `yarn why react`
4. Consider using a tool like [duplicate-package-checker-webpack-plugin](https://github.com/darrenscerri/duplicate-package-checker-webpack-plugin)

## Additional Resources

- [React Hooks Rules](https://reactjs.org/docs/hooks-rules.html)
- [Troubleshooting React Hooks](https://react.dev/link/invalid-hook-call)
- [Yarn Resolutions](https://classic.yarnpkg.com/lang/en/docs/selective-version-resolutions/)
