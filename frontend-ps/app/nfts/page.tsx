import NftCard from "@/components/nft-card";
import { title } from "@/components/primitives";
import { nfts } from "../mockdata";
import { NFTFilters } from "@/components/nft-filters";

export default function NftsPage() {
  return (
    <div>
      <h1 className={title()}>Prophet NFTs</h1>
      <div className="container mx-auto px-4 py-8">
        <NFTFilters />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-20">
          {nfts.map((nft) => (
            <NftCard
              key={nft.id}
              category={nft.category}
              predictionContent={nft.predictionContent}
              creationTime={nft.creationTime}
              prophetScore={nft.prophetScore}
              imageUrl={nft.imageUrl}
              id={nft.id}
              price={nft.price}
              creator={nft.creator}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
