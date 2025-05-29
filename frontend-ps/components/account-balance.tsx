import { useNetwork, useReadContract } from "@starknet-react/core";
import Erc20Abi from "../abi/token.abi.json";
import { ETH_SEPOLIA, STRK_SEPOLIA } from "@/utils/constant";
import { formatWalletCurrency } from "@/utils/helpers";
import Image from "next/image";

import ethLogo from "@/public/ethereum-eth-logo.png";
import strkLogo from "@/public/starknet-token-strk-logo.png";

type Props = {
  address: string;
};

function AccountBalance({ address }: Props) {
  const { chain } = useNetwork();
  console.log({ chain });
  const { data: eth, isLoading: ethLoading } = useReadContract({
    address: ETH_SEPOLIA,
    abi: Erc20Abi,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    watch: true,
  });

  const { data: strk, isLoading: strkLoading } = useReadContract({
    address: STRK_SEPOLIA,
    abi: Erc20Abi,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    watch: true,
  });

  // @ts-ignore
  const ethBalance = formatWalletCurrency(eth?.balance.low.toString());
  // @ts-ignore
  const strkBalance = formatWalletCurrency(strk?.balance?.low.toString());

  return (
    <div className="p-4 text-sm">
      <h3 className="mb-4 text-xl">Assets</h3>

      <div className="flex flex-col gap-4 ">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full md:h-12 md:w-12">
              <Image src={ethLogo} alt="ethereum logo" className="w-full" />
            </div>
            <div>
              <p className="mb-2 text-md">ETH</p>
              <p>Ethereum</p>
            </div>
          </div>
          <div className="mr-4 flex items-center">
            <p className="">{Number(ethBalance).toFixed(3)}</p>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full md:h-12 md:w-12">
              <Image src={strkLogo} alt="starknet logo" className="w-full" />
            </div>
            <div>
              <p className="mb-2 text-md">STRK</p>
              <p>Starknet token</p>
            </div>
          </div>
          <div className="mr-4 flex items-center">
            <p className="">{Number(strkBalance).toFixed(3)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountBalance;
