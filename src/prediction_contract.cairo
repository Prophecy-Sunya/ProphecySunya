#[starknet::contract]
mod PredictionContract {
    use starknet::ContractAddress;
    use core::array::ArrayTrait;
    use core::zeroable::Zeroable;
    use starknet::storage::Map;
    use prophecy_sunya::types::types::{Prediction, PredictionStatus};
    use prophecy_sunya::interfaces::interfaces::IPredictionContract;
    
    #[storage]
    struct Storage {
        predictions: Map<felt252, Prediction>,
        prediction_count: felt252,
        user_prediction_ids: Map<(ContractAddress, felt252), felt252>, // Maps (user, index) -> prediction_id
        user_prediction_count: Map<ContractAddress, felt252>,
    }
    
    #[constructor]
    fn constructor(ref self: ContractState) {
        self.prediction_count.write(0);
    }
    
    #[abi(embed_v0)]
    impl PredictionContractImpl of IPredictionContract<ContractState> {
        fn create_prediction(
            ref self: ContractState,
            content: felt252,
            category: felt252,
            expiration_time: felt252
        ) -> felt252 {
            // Get caller address
            let caller = starknet::get_caller_address();
            
            // Get current timestamp as felt252
            let block_timestamp: felt252 = starknet::get_block_timestamp().into();
            
            // Validate expiration time is in the future
            // Using subtraction and != instead of > for felt252 comparison
            let time_diff = expiration_time - block_timestamp;
            assert(time_diff != 0 && time_diff != 0 - 1, 'Expiration must be in future');
            
            // Get and increment prediction count
            let prediction_id = self.prediction_count.read();
            self.prediction_count.write(prediction_id + 1);
            
            // Create new prediction
            let prediction = Prediction {
                id: prediction_id,
                creator: caller,
                content: content,
                category: category,
                creation_time: block_timestamp,
                expiration_time: expiration_time,
                verification_status: PredictionStatus::PENDING,
                nft_id: 0,
            };
            
            // Store prediction
            self.predictions.write(prediction_id, prediction);
            
            // Get user's current prediction count
            let user_prediction_count = self.user_prediction_count.read(caller);
            
            // Store prediction ID in user's predictions mapping
            self.user_prediction_ids.write((caller, user_prediction_count), prediction_id);
            
            // Update user prediction count
            self.user_prediction_count.write(caller, user_prediction_count + 1);
            
            // Return prediction ID
            prediction_id
        }
        
        fn verify_prediction(
            ref self: ContractState,
            prediction_id: felt252,
            verification_result: felt252,
            oracle_signature: felt252
        ) -> bool {
            // Get caller address
            let _caller = starknet::get_caller_address();
            
            // TODO: Implement authorization check
            
            // Get prediction
            let mut prediction = self.predictions.read(prediction_id);
            
            // Validate prediction exists
            assert(prediction.id == prediction_id, 'Prediction does not exist');
            
            // Validate prediction has not expired
            // Get current timestamp as felt252
            let block_timestamp: felt252 = starknet::get_block_timestamp().into();
            
            // Using subtraction and != instead of > for felt252 comparison
            let time_diff = prediction.expiration_time - block_timestamp;
            assert(time_diff != 0 && time_diff != 0 - 1, 'Prediction expired');
            
            // Validate prediction has not been verified
            assert(prediction.verification_status == PredictionStatus::PENDING, 'Prediction already verified');
            
            // Update prediction
            if verification_result == 1 {
                prediction.verification_status = PredictionStatus::VERIFIED_TRUE;
            } else {
                prediction.verification_status = PredictionStatus::VERIFIED_FALSE;
            }
            
            // Store updated prediction
            self.predictions.write(prediction_id, prediction);
            
            // Return success
            true
        }
        
        fn get_prediction(self: @ContractState, prediction_id: felt252) -> Prediction {
            // Get prediction
            let prediction = self.predictions.read(prediction_id);
            
            // Validate prediction exists
            assert(prediction.id == prediction_id, 'Prediction does not exist');
            
            // Return prediction
            prediction
        }
        
        fn get_user_predictions(self: @ContractState, user: ContractAddress) -> Array<felt252> {
            // Create result array
            let mut result = ArrayTrait::new();
            
            // Get user prediction count
            let user_prediction_count = self.user_prediction_count.read(user);
            
            // If user has no predictions, return empty array
            if user_prediction_count == 0 {
                return result;
            }
            
            // Loop through user predictions and add to result
            let mut i: felt252 = 0;
            loop {
                if i == user_prediction_count {
                    break;
                }
                
                // Get prediction ID
                let prediction_id = self.user_prediction_ids.read((user, i));
                
                // Add to result
                result.append(prediction_id);
                
                // Increment counter
                i += 1;
            };
            
            // Return result
            result
        }
    }
}
