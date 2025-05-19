mod ProphecySunya {
    use starknet::ContractAddress;
    use array::ArrayTrait;
    use array::SpanTrait;
    use option::OptionTrait;
    use traits::Into;
    use traits::TryInto;
    use zeroable::Zeroable;
    use box::BoxTrait;
    use super::super::shared::src::types::{Prediction, PredictionStatus};
    use super::super::shared::src::interfaces::IPredictionContract;

    #[storage]
    struct Storage {
        predictions: LegacyMap<felt252, Prediction>,
        prediction_count: felt252,
        user_predictions: LegacyMap<(ContractAddress, felt252), felt252>,
        user_prediction_count: LegacyMap<ContractAddress, felt252>,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.prediction_count.write(0);
    }

    #[external(v0)]
    impl PredictionContractImpl of IPredictionContract<ContractState> {
        fn create_prediction(
            ref self: ContractState,
            content: felt252,
            category: felt252,
            expiration_time: felt252
        ) -> felt252 {
            // Get caller address
            let caller = starknet::get_caller_address();
            
            // Get current timestamp
            let block_timestamp = starknet::get_block_timestamp();
            
            // Validate expiration time is in the future
            assert(expiration_time > block_timestamp, 'Expiration must be in future');
            
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
                nft_id: 0, // No NFT minted yet
            };
            
            // Store prediction
            self.predictions.write(prediction_id, prediction);
            
            // Get user prediction count
            let user_prediction_count = self.user_prediction_count.read(caller);
            
            // Store user prediction mapping
            self.user_predictions.write((caller, user_prediction_count), prediction_id);
            
            // Increment user prediction count
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
            // Get caller address (should be oracle contract)
            let caller = starknet::get_caller_address();
            
            // TODO: Implement oracle validation
            // For now, we'll just check that oracle_signature is not zero
            assert(oracle_signature != 0, 'Invalid oracle signature');
            
            // Get prediction
            let mut prediction = self.predictions.read(prediction_id);
            
            // Validate prediction exists
            assert(prediction.id == prediction_id, 'Prediction does not exist');
            
            // Validate prediction is not already verified
            assert(prediction.verification_status == PredictionStatus::PENDING, 'Already verified');
            
            // Get current timestamp
            let block_timestamp = starknet::get_block_timestamp();
            
            // Validate prediction has not expired
            assert(prediction.expiration_time > block_timestamp, 'Prediction expired');
            
            // Update verification status
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
            // Get user prediction count
            let user_prediction_count = self.user_prediction_count.read(user);
            
            // Create array to store prediction IDs
            let mut prediction_ids = ArrayTrait::new();
            
            // Iterate through user predictions
            let mut i: felt252 = 0;
            while i < user_prediction_count {
                // Get prediction ID
                let prediction_id = self.user_predictions.read((user, i));
                
                // Add prediction ID to array
                prediction_ids.append(prediction_id);
                
                // Increment counter
                i += 1;
            }
            
            // Return prediction IDs
            prediction_ids
        }
    }
}
