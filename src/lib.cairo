// Root package lib.cairo
// This file is required by Scarb for the root package

// Re-export contract modules
mod contracts {
    // This is a placeholder that will be populated with actual exports
    // when the contract structure is finalized
}

// Export shared types and interfaces
mod shared {
    // Import from the shared package directly now that lib.cairo exists
    use shared::types;
    use shared::interfaces;
}
