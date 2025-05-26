#!/bin/bash

# Script to create symbolic links from contract files to lib.cairo
echo "Creating symbolic links for lib.cairo in each contract directory..."

# Navigate to the repository root
cd "$(dirname "$0")/.."

# Create symbolic links in each contract directory
for contract_dir in contracts/*/src/; do
  # Skip if lib.cairo already exists
  if [ -f "${contract_dir}lib.cairo" ]; then
    echo "lib.cairo already exists in ${contract_dir}, skipping"
    continue
  fi
  
  # Find the main contract file (assuming there's only one .cairo file or we take the one matching the directory name)
  contract_name=$(basename $(dirname $(dirname ${contract_dir})))
  contract_file="${contract_dir}${contract_name}_contract.cairo"
  
  # If specific file doesn't exist, find any .cairo file
  if [ ! -f "$contract_file" ]; then
    contract_file=$(find ${contract_dir} -name "*.cairo" | head -1)
  fi
  
  # Create symbolic link if contract file exists
  if [ -f "$contract_file" ]; then
    echo "Creating link from $(basename ${contract_file}) to lib.cairo in ${contract_dir}"
    ln -sf "$(basename ${contract_file})" "${contract_dir}lib.cairo"
  else
    echo "No .cairo file found in ${contract_dir}, skipping"
  fi
done

echo "Symbolic links creation complete!"
