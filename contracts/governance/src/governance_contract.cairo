mod GovernanceContract {
    use starknet::ContractAddress;
    use array::ArrayTrait;
    use array::SpanTrait;
    use option::OptionTrait;
    use traits::Into;
    use traits::TryInto;
    use zeroable::Zeroable;
    use box::BoxTrait;
    use super::super::shared::src::types::{Proposal, ProposalStatus};
    use super::super::shared::src::interfaces::IGovernanceContract;

    #[storage]
    struct Storage {
        proposals: LegacyMap<felt252, Proposal>,
        proposal_count: felt252,
        votes: LegacyMap<(felt252, ContractAddress), felt252>,
        prophet_scores: LegacyMap<ContractAddress, felt252>,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.proposal_count.write(0);
    }

    #[external(v0)]
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
            assert(prophet_score > 0, 'Insufficient prophet score');
            
            // Get current timestamp
            let block_timestamp = starknet::get_block_timestamp();
            
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
                status: ProposalStatus::ACTIVE,
                yes_votes: 0,
                no_votes: 0,
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
            
            // Get proposal
            let mut proposal = self.proposals.read(proposal_id);
            
            // Validate proposal exists
            assert(proposal.id == proposal_id, 'Proposal does not exist');
            
            // Validate proposal is active
            assert(proposal.status == ProposalStatus::ACTIVE, 'Proposal not active');
            
            // Get current timestamp
            let block_timestamp = starknet::get_block_timestamp();
            
            // Validate proposal has not ended
            assert(proposal.end_time > block_timestamp, 'Proposal ended');
            
            // Check if user has already voted
            let existing_vote = self.votes.read((proposal_id, caller));
            assert(existing_vote == 0, 'Already voted');
            
            // Get user's prophet score
            let prophet_score = self.prophet_scores.read(caller);
            assert(prophet_score > 0, 'No prophet score');
            
            // Record vote
            self.votes.write((proposal_id, caller), vote);
            
            // Update vote counts
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
            // Get caller address
            let caller = starknet::get_caller_address();
            
            // Get proposal
            let mut proposal = self.proposals.read(proposal_id);
            
            // Validate proposal exists
            assert(proposal.id == proposal_id, 'Proposal does not exist');
            
            // Validate proposal is active
            assert(proposal.status == ProposalStatus::ACTIVE, 'Proposal not active');
            
            // Get current timestamp
            let block_timestamp = starknet::get_block_timestamp();
            
            // Validate proposal has ended
            assert(proposal.end_time <= block_timestamp, 'Proposal not ended');
            
            // Determine if proposal passed
            if proposal.yes_votes > proposal.no_votes {
                proposal.status = ProposalStatus::PASSED;
                
                // TODO: Implement proposal execution logic
                // For now, we'll just update the status
                
                // Update to executed status
                proposal.status = ProposalStatus::EXECUTED;
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

        fn get_prophet_score(self: @ContractState, user: ContractAddress) -> felt252 {
            // Return prophet score
            self.prophet_scores.read(user)
        }
    }

    // Additional functions for contract management
    #[external(v0)]
    fn update_prophet_score(ref self: ContractState, user: ContractAddress, score: felt252) -> bool {
        // Get caller address (should be NFT contract or authorized address)
        let caller = starknet::get_caller_address();
        
        // TODO: Implement authorization check
        
        // Update prophet score
        self.prophet_scores.write(user, score);
        
        // Return success
        true
    }
}
