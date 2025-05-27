# Debug Directory Fix

## Issue
After fixing the contract name matching, the deployment was failing with a new error:
```
Error checking directory /app/target/dev: Error: ENOENT: no such file or directory, open '/app/temp_debug/artifact_content.json'
```

## Root Cause Analysis
The issue was related to missing directories in the Docker container:

1. **Missing Debug Directory**: The script was trying to write debug files to `/app/temp_debug/`, but this directory didn't exist in the Docker container.

2. **No Error Handling**: The file writing operations were not wrapped in try-catch blocks, causing the entire deployment to fail if a debug file couldn't be written.

3. **Critical Path Interruption**: A non-critical debug operation was interrupting the main deployment flow.

## Solution
The fix involves making the debug file operations more robust:

1. **Added Directory Creation Function**:
   ```typescript
   function ensureDirectoryExists(dirPath: string): void {
     try {
       if (!fs.existsSync(dirPath)) {
         console.log(`Creating directory: ${dirPath}`);
         fs.mkdirSync(dirPath, { recursive: true });
       }
     } catch (error) {
       console.warn(`Warning: Could not create directory ${dirPath}: ${error}`);
       // Continue execution even if directory creation fails
     }
   }
   ```

2. **Added Safe File Writing Function**:
   ```typescript
   function safeWriteFileSync(filePath: string, content: string): boolean {
     try {
       // Ensure the directory exists
       const dirPath = path.dirname(filePath);
       ensureDirectoryExists(dirPath);
       
       // Write the file
       fs.writeFileSync(filePath, content);
       console.log(`Successfully wrote file: ${filePath}`);
       return true;
     } catch (error) {
       console.warn(`Warning: Could not write file ${filePath}: ${error}`);
       return false;
     }
   }
   ```

3. **Proactive Directory Creation**:
   ```typescript
   // Create deployments directory if it doesn't exist
   ensureDirectoryExists(DEPLOYMENTS_DIR);

   // Create debug directory if it doesn't exist
   ensureDirectoryExists(DEBUG_DIR);
   ```

4. **Added Version Identifier** for runtime verification:
   ```typescript
   // DEPLOY SCRIPT VERSION 2.4 - DEBUG DIRECTORY FIX
   console.log("Running deployment script v2.4 with debug directory fix");
   ```

## Verification
The fix can be verified by:
1. Checking that the deployment script continues even if debug directories don't exist
2. Confirming that file write errors are handled gracefully
3. Verifying that the deployment proceeds to contract matching and deployment

## Best Practices for File Operations in Deployment Scripts
1. Always check if directories exist before writing files
2. Use try-catch blocks around file operations
3. Make non-critical operations fail gracefully
4. Separate critical path operations from debugging/logging operations
5. Use warning logs instead of errors for non-critical failures

## Additional Recommendations
1. Consider using a dedicated logging library with built-in error handling
2. Add configuration options to enable/disable debug file writing
3. Use environment variables to control debug output locations
4. Implement a cleanup routine for temporary debug files
