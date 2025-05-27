#[starknet::contract]
mod GovernanceContract {
    use starknet::ContractAddress;
    use core::array::ArrayTrait;
    use core::zeroable::Zeroable;
    use starknet::storage::Map;
    use prophecy_sunya::types::types::{Proposal, ProposalStatus};
    use prophecy_sunya::interfaces::interfaces::IGovernanceContract;
    
    #[storage]
    struct Storage {
        proposals: Map<felt252, Proposal>,
        proposal_count: felt252,
        votes: Map<(felt252, ContractAddress), felt252>,
        prophet_scores: Map<ContractAddress, felt252>,
    }
    #[constructor]
    fn constructor(ref self: ContractState) {
        self.proposal_count.write(0);
    }
    #[abi(embed_v0)]
    impl GovernanceContractImpl of IGovernanceContract<ContractState> {
        fn create_proposal(
            ref self: ContractState,
            description: felt252,
            duration: felt252
        ) -> felt252 {
            // Get caller address
            let caller = starknet::get_caller_address();
            
            // Validate caller has prophet score
            let prophet_score = self.prophet_scores.read(caller);
            assert(prophet_score != 0, 'Insufficient prophet score');
            
            // Get current timestamp as felt252
            let block_timestamp: felt252 = starknet::get_block_timestamp().into();
            
            // Calculate end time
            let end_time = block_timestamp + duration;
            
            // Get and increment proposal count
            let proposal_id = self.proposal_count.read();
            self.proposal_count.write(proposal_id + 1);
            
            // Create new proposal
            let proposal = Proposal {
                id: proposal_id,
                creator: caller,
                description: description,
                start_time: block_timestamp,
                end_time: end_time,
                yes_votes: 0,
                no_votes: 0,
                status: ProposalStatus::ACTIVE,
            };
            
            // Store proposal
            self.proposals.write(proposal_id, proposal);
            
            // Return proposal ID
            proposal_id
        }
        
        fn cast_vote(
            ref self: ContractState,
            proposal_id: felt252,
            vote: felt252
        ) -> bool {
            // Get caller address
            let caller = starknet::get_caller_address();
            
            // Validate caller has prophet score
            let prophet_score = self.prophet_scores.read(caller);
            assert(prophet_score != 0, 'Insufficient prophet score');
            
            // Get proposal
            let mut proposal = self.proposals.read(proposal_id);
            
            // Validate proposal exists
            assert(proposal.id == proposal_id, 'Proposal does not exist');
            
            // Validate proposal is active
            assert(proposal.status == ProposalStatus::ACTIVE, 'Proposal not active');
            
            // Get current timestamp as felt252
            let block_timestamp: felt252 = starknet::get_block_timestamp().into();
            
            // Validate proposal has not ended
            // Using != and subtraction instead of > for felt252 comparison
            assert(proposal.end_time - block_timestamp != 0, 'Proposal ended');
            
            // Validate user has not already voted
            let previous_vote = self.votes.read((proposal_id, caller));
            assert(previous_vote == 0, 'Already voted');
            
            // Record vote
            self.votes.write((proposal_id, caller), vote);
            
            // Update vote count
            if vote == 1 {
                proposal.yes_votes += prophet_score;
            } else {
                proposal.no_votes += prophet_score;
            }
            
            // Store updated proposal
            self.proposals.write(proposal_id, proposal);
            
            // Return success
            true
        }
        
        fn execute_proposal(
            ref self: ContractState,
            proposal_id: felt252
        ) -> bool {
            // Get proposal
            let mut proposal = self.proposals.read(proposal_id);
            
            // Validate proposal exists
            assert(proposal.id == proposal_id, 'Proposal does not exist');
            
            // Validate proposal is active
            assert(proposal.status == ProposalStatus::ACTIVE, 'Proposal not active');
            
            // Get current timestamp as felt252
            let block_timestamp: felt252 = starknet::get_block_timestamp().into();
            
            // Validate proposal has ended
            // Fix PartialOrd error by using subtraction and equality check
            let time_diff = block_timestamp - proposal.end_time;
            assert(time_diff != 0 - 1, 'Proposal not ended'); // time_diff >= 0
            
            // Determine result
            // Fix PartialOrd error by using subtraction
            let vote_diff = proposal.yes_votes - proposal.no_votes;
            if proposal.yes_votes != 0 && vote_diff != 0 - 1 {
                proposal.status = ProposalStatus::PASSED;
            } else {
                proposal.status = ProposalStatus::REJECTED;
            }
            
            // Store updated proposal
            self.proposals.write(proposal_id, proposal);
            
            // Return success
            true
        }
        
        fn get_proposal(self: @ContractState, proposal_id: felt252) -> Proposal {
            // Get proposal
            let proposal = self.proposals.read(proposal_id);
            
            // Validate proposal exists
            assert(proposal.id == proposal_id, 'Proposal does not exist');
            
            // Return proposal
            proposal
        }
        
        fn get_prophet_score(self: @ContractState, user: starknet::ContractAddress) -> felt252 {
            // Return prophet score
            self.prophet_scores.read(user)
        }
    }
}
