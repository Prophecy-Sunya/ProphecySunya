import {
  CurrencyDollarIcon,
  CheckBadgeIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";

export const predictions = [
  {
    id: "1",
    content: "Ethereum will reach $10,000 by the end of 2025",
    category: "Crypto",
    creator: "0x123...456",
    expirationTime: new Date(2025, 11, 31).getTime(),
    verificationStatus: "PENDING",
  },
  {
    id: "2",
    content: "Bitcoin will have another halving in April 2024",
    category: "Crypto",
    creator: "0x789...012",
    expirationTime: new Date(2024, 3, 30).getTime(),
    verificationStatus: "VERIFIED_TRUE",
  },
  {
    id: "3",
    content: "Starknet TVL will exceed $1B in 2024",
    category: "DeFi",
    creator: "0x345...678",
    expirationTime: new Date(2024, 11, 31).getTime(),
    verificationStatus: "PENDING",
  },
];

export const features = [
  {
    id: "123",
    name: "Create",
    description:
      "Create predictions about future events with specific timeframes and categories.",
    Icon: CurrencyDollarIcon,
  },
  {
    id: "1234",
    name: "Verify",
    description:
      "Predictions are verified through AI oracles and community governance.",
    Icon: CheckBadgeIcon,
  },
  {
    id: "12345",
    name: "Mint",
    description:
      "Verified predictions can be minted as NFTs with prophet scores.",
    Icon: CircleStackIcon,
  },
];

export const nfts = [
  {
    id: "1",
    predictionContent: "Ethereum will reach $10,000 by the end of 2025",
    category: "Crypto",
    creationTime: new Date(2023, 5, 15).getTime(),
    prophetScore: 85,
    imageUrl:
      "https://cdn.pixabay.com/photo/2022/03/03/20/47/the-simpson-7046041_1280.jpg",
    price: 0.5,
    creator: "0x123...456",
  },
  {
    id: "2",
    predictionContent: "Bitcoin will have another halving in April 2024",
    category: "Crypto",
    creationTime: new Date(2023, 6, 20).getTime(),
    prophetScore: 95,
    imageUrl:
      "https://cdn.pixabay.com/photo/2022/01/17/17/20/bored-6945309_1280.png",
    price: 0.7,
    creator: "0x123...456",
  },
];

export const proposals = [
  {
    id: "1",
    description: "Increase oracle verification threshold to 75%",
    creator: "0x123...456",
    startTime: new Date(2025, 5, 15).getTime(),
    endTime: new Date(2025, 7, 15).getTime(),
    status: "ACTIVE",
    yesVotes: 120,
    noVotes: 45,
  },
  {
    id: "2",
    description: "Add support for Ethereum L1 prediction bridging",
    creator: "0x789...012",
    startTime: new Date(2025, 4, 10).getTime(),
    endTime: new Date(2025, 4, 20).getTime(),
    status: "PASSED",
    yesVotes: 230,
    noVotes: 20,
  },
];
