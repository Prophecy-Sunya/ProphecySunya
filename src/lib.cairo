// Root package lib.cairo
// This file is required by Scarb for the root package

// Re-export contract modules
mod contracts {
    // This is a placeholder that will be populated with actual exports
    // when the contract structure is finalized
}

// Export shared types and interfaces
mod shared {
    // Use the full path to the shared module in the workspace
    use prophecy_sunya::contracts::shared::src::types;
    use prophecy_sunya::contracts::shared::src::interfaces;
}
