// Shared library for Prophecy Sunya contracts
// Exposes common types and interfaces used across contracts
// Re-export types module
mod types;
// Re-export interfaces module
mod interfaces;
// Re-export all types and interfaces for external use
use types::{Prediction, Verification, Token, Proposal, BridgedPrediction, PredictionStatus, ProposalStatus, BridgeStatus};
use interfaces::{IPredictionContract, INFTContract, IGasTankContract, IOracleContract, IGovernanceContract, IBridgeContract};
