#[starknet::contract]
mod ProphecyNFT {
    use starknet::ContractAddress;
    use array::ArrayTrait;
    use array::SpanTrait;
    use option::OptionTrait;
    use traits::Into;
    use traits::TryInto;
    use zeroable::Zeroable;
    use box::BoxTrait;
    use super::super::shared::src::types::{Token};
    use super::super::shared::src::interfaces::INFTContract;
    #[storage]
    struct Storage {
        tokens: LegacyMap<felt252, Token>,
        token_count: felt252,
        owner_tokens: LegacyMap<(ContractAddress, felt252), felt252>,
        owner_token_count: LegacyMap<ContractAddress, felt252>,
        prediction_to_token: LegacyMap<felt252, felt252>,
    }
    #[constructor]
    fn constructor(ref self: ContractState) {
        self.token_count.write(0);
    }
    #[external(v0)]
    impl NFTContractImpl of INFTContract<ContractState> {
        fn mint(
            ref self: ContractState,
            to: ContractAddress,
            prediction_id: felt252,
            metadata_uri: felt252
        ) -> felt252 {
            // Get caller address (should be prediction contract or authorized address)
            let caller = starknet::get_caller_address();
            
            // TODO: Implement authorization check
            
            // Check if prediction already has an NFT
            let existing_token = self.prediction_to_token.read(prediction_id);
            assert(existing_token == 0, 'NFT already exists for prediction');
            
            // Get current timestamp
            let block_timestamp = starknet::get_block_timestamp();
            
            // Get and increment token count
            let token_id = self.token_count.read();
            self.token_count.write(token_id + 1);
            
            // Create new token
            let token = Token {
                id: token_id,
                owner: to,
                prediction_id: prediction_id,
                metadata_uri: metadata_uri,
                creation_time: block_timestamp,
            };
            
            // Store token
            self.tokens.write(token_id, token);
            
            // Get owner token count
            let owner_token_count = self.owner_token_count.read(to);
            
            // Store owner token mapping
            self.owner_tokens.write((to, owner_token_count), token_id);
            
            // Increment owner token count
            self.owner_token_count.write(to, owner_token_count + 1);
            
            // Store prediction to token mapping
            self.prediction_to_token.write(prediction_id, token_id);
            
            // Return token ID
            token_id
        }
        fn transfer(
            ref self: ContractState,
            to: ContractAddress,
            token_id: felt252
        ) -> bool {
            // Get caller address
            let caller = starknet::get_caller_address();
            
            // Get token
            let mut token = self.tokens.read(token_id);
            
            // Validate token exists
            assert(token.id == token_id, 'Token does not exist');
            
            // Validate caller is token owner
            assert(token.owner == caller, 'Not token owner');
            
            // Get current owner token count
            let owner_token_count = self.owner_token_count.read(caller);
            
            // Get new owner token count
            let new_owner_token_count = self.owner_token_count.read(to);
            
            // Update token owner
            token.owner = to;
            
            // Store updated token
            self.tokens.write(token_id, token);
            
            // Store new owner token mapping
            self.owner_tokens.write((to, new_owner_token_count), token_id);
            
            // Increment new owner token count
            self.owner_token_count.write(to, new_owner_token_count + 1);
            
            // Return success
            true
        }
        fn get_token(self: @ContractState, token_id: felt252) -> Token {
            // Get token
            let token = self.tokens.read(token_id);
            
            // Validate token exists
            assert(token.id == token_id, 'Token does not exist');
            
            // Return token
            token
        }
        fn get_owner_tokens(self: @ContractState, owner: ContractAddress) -> Array<felt252> {
            // Get owner token count
            let owner_token_count = self.owner_token_count.read(owner);
            
            // Create array to store token IDs
            let mut token_ids = ArrayTrait::new();
            
            // Iterate through owner tokens
            let mut i: felt252 = 0;
            while i < owner_token_count {
                // Get token ID
                let token_id = self.owner_tokens.read((owner, i));
                
                // Add token ID to array
                token_ids.append(token_id);
                
                // Increment counter
                i += 1;
            }
            
            // Return token IDs
            token_ids
        }
        fn get_token_by_prediction(self: @ContractState, prediction_id: felt252) -> Token {
            // Get token ID
            let token_id = self.prediction_to_token.read(prediction_id);
            
            // Validate token exists
            assert(token_id != 0, 'No token for prediction');
            
            // Get token
            let token = self.tokens.read(token_id);
            
            // Return token
            token
        }
    }
}
