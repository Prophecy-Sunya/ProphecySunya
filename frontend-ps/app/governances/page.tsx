import { title } from "@/components/primitives";
import { ProposalCard } from "@/components/proposal-card";
import { ProposalFilters } from "@/components/proposal-filters";
import { proposals } from "../mockdata";

export default function GovernancesPage() {
  return (
    <div>
      <h1 className={title()}>Active Proposals</h1>
      <div className="container mx-auto px-4 py-8">
        <ProposalFilters />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
          {proposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      </div>
    </div>
  );
}
