#[starknet::contract]
mod BridgeContract {
    use starknet::ContractAddress;
    use core::array::ArrayTrait;
    use core::zeroable::Zeroable;
    use starknet::storage::Map;
    use prophecy_sunya::types::types::{BridgedPrediction, BridgeStatus};
    use prophecy_sunya::interfaces::interfaces::IBridgeContract;
    
    #[storage]
    struct Storage {
        bridged_predictions: Map<felt252, BridgedPrediction>,
        bridged_count: felt252,
        external_chain_verifiers: Map<felt252, ContractAddress>,
    }
    #[constructor]
    fn constructor(ref self: ContractState) {
        self.bridged_count.write(0);
    }
    #[abi(embed_v0)]
    impl BridgeContractImpl of IBridgeContract<ContractState> {
        fn bridge_prediction(
            ref self: ContractState,
            source_chain: felt252,
            source_id: felt252,
            content: felt252,
            category: felt252,
            expiration_time: felt252,
            proof: Array<felt252>
        ) -> felt252 {
            // Get caller address
            let _caller = starknet::get_caller_address();
            
            // Validate source chain has a registered verifier
            let verifier = self.external_chain_verifiers.read(source_chain);
            assert(!verifier.is_zero(), 'No verifier for source chain');
            
            // TODO: Implement proof validation
            // For now, we'll just check that proof is not empty
            assert(proof.len() > 0, 'Invalid proof');
            
            // Get and increment bridged count
            let bridged_id = self.bridged_count.read();
            self.bridged_count.write(bridged_id + 1);
            
            // Create new bridged prediction with correct fields
            // Note: BridgedPrediction only has id, source_chain, source_id, starknet_id, status
            let bridged_prediction = BridgedPrediction {
                id: bridged_id,
                source_chain: source_chain,
                source_id: source_id,
                starknet_id: 0, // Will be set later when verified
                status: BridgeStatus::PENDING,
            };
            
            // Store bridged prediction
            self.bridged_predictions.write(bridged_id, bridged_prediction);
            
            // Return bridged ID
            bridged_id
        }
        
        fn verify_bridged_prediction(
            ref self: ContractState,
            bridged_id: felt252,
            verification_result: felt252,
            proof: Array<felt252>
        ) -> bool {
            // Get caller address (should be oracle contract)
            let _caller = starknet::get_caller_address();
            
            // TODO: Implement oracle validation
            
            // Get bridged prediction
            let bridged_prediction = self.bridged_predictions.read(bridged_id);
            
            // Validate bridged prediction exists
            assert(bridged_prediction.id == bridged_id, 'Bridged prediction not found');
            
            // Validate bridged prediction is pending
            assert(bridged_prediction.status == BridgeStatus::PENDING, 'Not pending');
            
            // Create updated prediction with new status
            let new_status = if verification_result == 1 {
                BridgeStatus::CONFIRMED
            } else {
                BridgeStatus::REJECTED
            };
            
            // Create updated prediction with correct fields
            let updated_prediction = BridgedPrediction {
                id: bridged_prediction.id,
                source_chain: bridged_prediction.source_chain,
                source_id: bridged_prediction.source_id,
                starknet_id: bridged_prediction.starknet_id,
                status: new_status,
            };
            
            // Store updated bridged prediction
            self.bridged_predictions.write(bridged_id, updated_prediction);
            
            // Return success
            true
        }
        
        fn get_bridged_prediction(self: @ContractState, bridged_id: felt252) -> BridgedPrediction {
            // Get bridged prediction
            let bridged_prediction = self.bridged_predictions.read(bridged_id);
            
            // Validate bridged prediction exists
            assert(bridged_prediction.id == bridged_id, 'Bridged prediction not found');
            
            // Return bridged prediction
            bridged_prediction
        }
    }
    
    // Additional functions not in the interface
    #[generate_trait]
    impl BridgeContractHelperImpl of BridgeContractHelperTrait {
        fn register_external_chain_verifier(
            ref self: ContractState,
            chain_id: felt252,
            verifier: ContractAddress
        ) -> bool {
            // Get caller address (should be governance contract)
            let _caller = starknet::get_caller_address();
            
            // TODO: Implement governance validation
            
            // Register verifier
            self.external_chain_verifiers.write(chain_id, verifier);
            
            // Return success
            true
        }
        
        fn get_external_chain_verifier(self: @ContractState, chain_id: felt252) -> ContractAddress {
            // Return verifier
            self.external_chain_verifiers.read(chain_id)
        }
    }
}
