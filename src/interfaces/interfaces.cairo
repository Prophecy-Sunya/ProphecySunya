// Import types at the top of the file
use super::super::types::types::{Prediction, Verification, Token, Proposal, BridgedPrediction};

#[starknet::interface]
trait IPredictionContract<TContractState> {
    fn create_prediction(
        ref self: TContractState,
        content: felt252,
        category: felt252,
        expiration_time: felt252
    ) -> felt252;
    fn verify_prediction(
        ref self: TContractState,
        prediction_id: felt252,
        verification_result: felt252,
        oracle_signature: felt252
    ) -> bool;
    fn get_prediction(self: @TContractState, prediction_id: felt252) -> Prediction;
    fn get_user_predictions(self: @TContractState, user: starknet::ContractAddress) -> Array<felt252>;
}
#[starknet::interface]
trait INFTContract<TContractState> {
    fn mint(
        ref self: TContractState,
        to: starknet::ContractAddress,
        prediction_id: felt252,
        metadata_uri: felt252
    ) -> felt252;
    fn transfer(
        ref self: TContractState,
        token_id: felt252,
        to: starknet::ContractAddress
    ) -> bool;
    fn update_prophet_score(
        ref self: TContractState,
        token_id: felt252,
        new_score: felt252
    ) -> bool;
    fn get_token(self: @TContractState, token_id: felt252) -> Token;
    fn get_owner_tokens(self: @TContractState, owner: starknet::ContractAddress) -> Array<felt252>;
}
#[starknet::interface]
trait IGasTankContract<TContractState> {
    fn sponsor_transaction(
        ref self: TContractState,
        user: starknet::ContractAddress,
        transaction_type: felt252
    ) -> bool;
    fn execute_meta_transaction(
        ref self: TContractState,
        user: starknet::ContractAddress,
        target_contract: starknet::ContractAddress,
        function_selector: felt252,
        calldata: Array<felt252>,
        signature: Array<felt252>
    ) -> Array<felt252>;
    fn get_user_allowance(self: @TContractState, user: starknet::ContractAddress) -> felt252;
}
#[starknet::interface]
trait IOracleContract<TContractState> {
    fn submit_verification(
        ref self: TContractState,
        prediction_id: felt252,
        result: felt252,
        evidence_hash: felt252
    ) -> felt252;
    fn challenge_verification(
        ref self: TContractState,
        verification_id: felt252,
        challenge_evidence: felt252
    ) -> bool;
    fn get_verification(self: @TContractState, verification_id: felt252) -> Verification;
}
#[starknet::interface]
trait IGovernanceContract<TContractState> {
    fn create_proposal(
        ref self: TContractState,
        description: felt252,
        duration: felt252
    ) -> felt252;
    fn cast_vote(
        ref self: TContractState,
        proposal_id: felt252,
        vote: felt252
    ) -> bool;
    fn execute_proposal(
        ref self: TContractState,
        proposal_id: felt252
    ) -> bool;
    fn get_proposal(self: @TContractState, proposal_id: felt252) -> Proposal;
    fn get_prophet_score(self: @TContractState, user: starknet::ContractAddress) -> felt252;
}
#[starknet::interface]
trait IBridgeContract<TContractState> {
    fn bridge_prediction(
        ref self: TContractState,
        source_chain: felt252,
        source_id: felt252,
        content: felt252,
        category: felt252,
        expiration_time: felt252,
        proof: Array<felt252>
    ) -> felt252;
    fn verify_bridged_prediction(
        ref self: TContractState,
        bridged_id: felt252,
        verification_result: felt252,
        proof: Array<felt252>
    ) -> bool;
    fn get_bridged_prediction(self: @TContractState, bridged_id: felt252) -> BridgedPrediction;
}
