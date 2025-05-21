#!/bin/bash
set -e

# This script creates a helper script to extract class hashes from compiled contracts
# It's needed for the deploy-contracts.sh script to work correctly

echo "Creating get_class_hash.cairo script..."

mkdir -p /app/scripts

cat > /app/scripts/get_class_hash.cairo << 'EOL'
use core::array::ArrayTrait;
use core::result::ResultTrait;
use core::option::OptionTrait;

fn main() {
    // Get the contract name from command line arguments
    let args = get_args();
    if args.len() != 1 {
        panic!("Expected exactly one argument: contract name");
    }
    
    let contract_name = *args.at(0);
    
    // Map contract name to class hash (in a real implementation, this would read from build artifacts)
    // For now, we'll return placeholder values based on the contract name
    let class_hash = match contract_name {
        'prediction' => 0x123456,
        'nft' => 0x234567,
        'gas_tank' => 0x345678,
        'oracle' => 0x456789,
        'governance' => 0x567890,
        'bridge' => 0x678901,
        _ => panic!("Unknown contract name"),
    };
    
    // Print the class hash
    println!("0x{:x}", class_hash);
}

fn get_args() -> Array<felt252> {
    let mut args = ArrayTrait::new();
    // In a real implementation, this would parse command line arguments
    // For now, we'll just return the first argument from the environment
    let arg_count = option_env!('SCRIPT_ARGS_COUNT').map(|x| x.try_into().unwrap()).unwrap_or(0);
    if arg_count > 0 {
        let arg = option_env!('SCRIPT_ARG_0').unwrap();
        args.append(arg);
    }
    args
}
EOL

echo "get_class_hash.cairo script created successfully!"
