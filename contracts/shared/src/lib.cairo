mod types;
mod interfaces;

// Re-export all types and interfaces for external use
use types::{Prediction, Verification, Token, Proposal, BridgedPrediction, PredictionStatus, ProposalStatus, BridgeStatus};
use interfaces::{IPredictionContract, INFTContract, IGasTankContract, IOracleContract, IGovernanceContract, IBridgeContract};
