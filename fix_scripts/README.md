# Fix for ProphecySunya Contract Artifact Generation

This script creates symbolic links from each contract's main file to `lib.cairo` in each contract directory.

## Problem

The Scarb build process was failing to generate contract artifacts because it expects a `lib.cairo` file as the entry point for each package, but the repository uses different naming conventions (e.g., `prediction_contract.cairo`).

## Solution

This script creates symbolic links from each contract's main file to `lib.cairo` in each contract directory, allowing Scarb to find the entry points without changing the original code structure.

## Usage

```bash
./fix_scripts/create_lib_links.sh
```

## What it does

1. Scans all contract directories in `contracts/*/src/`
2. For each directory, creates a symbolic link from the main contract file to `lib.cairo`
3. Handles special cases like the shared directory

## Output

The script will print information about each link it creates and any directories it skips.
