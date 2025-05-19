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
                prophet_score: 1, // Initial prophet score
            };
            
            // Store token
            self.tokens.write(token_id, token);
            
            // Map prediction to token
            self.prediction_to_token.write(prediction_id, token_id);
            
            // Get owner token count
            let owner_token_count = self.owner_token_count.read(to);
            
            // Store owner token mapping
            self.owner_tokens.write((to, owner_token_count), token_id);
            
            // Increment owner token count
            self.owner_token_count.write(to, owner_token_count + 1);
            
            // Return token ID
            token_id
        }

        fn transfer(
            ref self: ContractState,
            token_id: felt252,
            to: ContractAddress
        ) -> bool {
            // Get caller address
            let caller = starknet::get_caller_address();
            
            // Get token
            let mut token = self.tokens.read(token_id);
            
            // Validate token exists
            assert(token.id == token_id, 'Token does not exist');
            
            // Validate caller is token owner
            assert(token.owner == caller, 'Not token owner');
            
            // Validate destination is not zero address
            assert(!to.is_zero(), 'Cannot transfer to zero address');
            
            // Get current owner token count
            let owner_token_count = self.owner_token_count.read(caller);
            
            // Find token index in owner's tokens
            let mut token_index: felt252 = 0;
            let mut found = false;
            
            while token_index < owner_token_count {
                if self.owner_tokens.read((caller, token_index)) == token_id {
                    found = true;
                    break;
                }
                token_index += 1;
            }
            
            assert(found, 'Token not found in owner tokens');
            
            // Remove token from current owner
            if token_index < owner_token_count - 1 {
                // Move last token to this position
                let last_token_id = self.owner_tokens.read((caller, owner_token_count - 1));
                self.owner_tokens.write((caller, token_index), last_token_id);
            }
            
            // Decrement owner token count
            self.owner_token_count.write(caller, owner_token_count - 1);
            
            // Add token to new owner
            let new_owner_token_count = self.owner_token_count.read(to);
            self.owner_tokens.write((to, new_owner_token_count), token_id);
            self.owner_token_count.write(to, new_owner_token_count + 1);
            
            // Update token owner
            token.owner = to;
            self.tokens.write(token_id, token);
            
            // Return success
            true
        }

        fn update_prophet_score(
            ref self: ContractState,
            token_id: felt252,
            new_score: felt252
        ) -> bool {
            // Get caller address (should be governance contract or authorized address)
            let caller = starknet::get_caller_address();
            
            // TODO: Implement authorization check
            
            // Get token
            let mut token = self.tokens.read(token_id);
            
            // Validate token exists
            assert(token.id == token_id, 'Token does not exist');
            
            // Update prophet score
            token.prophet_score = new_score;
            
            // Store updated token
            self.tokens.write(token_id, token);
            
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
    }
}
