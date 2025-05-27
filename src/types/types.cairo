// ProphecySunya Shared Types
// This file contains common data structures used across contracts

use starknet::ContractAddress;

#[derive(Drop, Serde, starknet::Store)]
struct Prediction {
    id: felt252,
    creator: starknet::ContractAddress,
    content: felt252,
    category: felt252,
    creation_time: felt252,
    expiration_time: felt252,
    verification_status: felt252,
    nft_id: felt252,
}

#[derive(Drop, Serde, starknet::Store)]
struct Verification {
    id: felt252,
    prediction_id: felt252,
    oracle: starknet::ContractAddress,
    result: felt252,
    timestamp: felt252,
    evidence_hash: felt252,
}

#[derive(Drop, Serde, starknet::Store)]
struct Token {
    id: felt252,
    owner: starknet::ContractAddress,
    prediction_id: felt252,
    metadata_uri: felt252,
    creation_time: felt252,
    prophet_score: felt252,
}

#[derive(Drop, Serde, starknet::Store)]
struct Proposal {
    id: felt252,
    creator: starknet::ContractAddress,
    description: felt252,
    start_time: felt252,
    end_time: felt252,
    status: felt252,
    yes_votes: felt252,
    no_votes: felt252,
}

#[derive(Drop, Serde, starknet::Store)]
struct BridgedPrediction {
    id: felt252,
    source_chain: felt252,
    source_id: felt252,
    starknet_id: felt252,
    status: felt252,
}

// Status constants for predictions
mod PredictionStatus {
    const PENDING: felt252 = 0;
    const VERIFIED_TRUE: felt252 = 1;
    const VERIFIED_FALSE: felt252 = 2;
    const EXPIRED: felt252 = 3;
    const CHALLENGED: felt252 = 4;
}

// Status constants for proposals
mod ProposalStatus {
    const ACTIVE: felt252 = 0;
    const PASSED: felt252 = 1;
    const REJECTED: felt252 = 2;
    const EXECUTED: felt252 = 3;
    const EXPIRED: felt252 = 4;
}

// Status constants for bridged predictions
mod BridgeStatus {
    const PENDING: felt252 = 0;
    const CONFIRMED: felt252 = 1;
    const REJECTED: felt252 = 2;
}
