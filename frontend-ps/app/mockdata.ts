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

export const featuredMarkets = [
  {
    id: "1",
    title: "CRIME SZN OR MOON?",
    imageUrl:
      "https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "crypto",
    yesPercentage: 15,
    noPercentage: 85,
    isHot: true,
    timeRemaining: "05d",
  },
  {
    id: "2",
    title: "Will Beercoin 2.0 oopsie moment?",
    imageUrl:
      "https://images.pexels.com/photos/1590/technology-computer-chips-gigabyte.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "memecoin",
    yesPercentage: 15,
    noPercentage: 85,
    isNew: true,
    timeRemaining: "14h",
  },
  {
    id: "3",
    title: "Next runner launched on?",
    imageUrl:
      "https://images.pexels.com/photos/1447418/pexels-photo-1447418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "crypto",
    yesPercentage: 60,
    noPercentage: 40,
    isMulti: true,
    outcomes: ["ETH", "SOL", "BASE", "Other"],
    timeRemaining: "38m",
  },
];

export const markets = [
  {
    id: "1",
    title: "Will Ethereum reach $5,000 by end of 2024?",
    description: "Prediction about ETH price target",
    category: "Crypto",
    yesChance: 68,
    noChance: 32,
    volume: "$156.2K",
    timeLeft: "15d 8h",
    traders: 342,
    isNew: true,
    isMulti: false,
  },
  {
    id: "2",
    title: "Next major crypto exchange to face regulatory issues?",
    description: "Which exchange will be next?",
    category: "Crypto",
    yesChance: 45,
    noChance: 55,
    volume: "$89.7K",
    timeLeft: "8d 12h",
    traders: 198,
    isNew: false,
    isMulti: true,
  },
  {
    id: "3",
    title: "Will AI tokens outperform Bitcoin in 2024?",
    description: "AI sector vs BTC performance",
    category: "Technology",
    yesChance: 72,
    noChance: 28,
    volume: "$234.1K",
    timeLeft: "22d 4h",
    traders: 567,
    isNew: true,
    isMulti: false,
  },
  {
    id: "4",
    title: "US Presidential Election 2024 outcome?",
    description: "Who will win the presidency?",
    category: "Politics",
    yesChance: 52,
    noChance: 48,
    volume: "$1.2M",
    timeLeft: "45d 16h",
    traders: 2341,
    isNew: false,
    isMulti: true,
  },
  {
    id: "5",
    title: "Will Tesla stock hit $300 before Q2 2024?",
    description: "TSLA price prediction",
    category: "Technology",
    yesChance: 38,
    noChance: 62,
    volume: "$67.8K",
    timeLeft: "12d 20h",
    traders: 156,
    isNew: false,
    isMulti: false,
  },
  {
    id: "6",
    title: "Next team to win the Champions League?",
    description: "UEFA Champions League winner",
    category: "Sports",
    yesChance: 25,
    noChance: 75,
    volume: "$445.6K",
    timeLeft: "89d 12h",
    traders: 1023,
    isNew: false,
    isMulti: true,
  },
];

export const hotPredictions = [
  {
    id: "1",
    title: "Bitcoin reaches $100K by 2024?",
    yesChance: 75,
    noChance: 25,
    volume: "$45.2K",
    timeLeft: "2d 14h",
    isNew: true,
  },
  {
    id: "2",
    title: "Ethereum 2.0 staking rewards exceed 8%?",
    yesChance: 42,
    noChance: 58,
    volume: "$23.1K",
    timeLeft: "5d 8h",
    isNew: false,
  },
  {
    id: "3",
    title: "Next major crypto exchange hack?",
    yesChance: 18,
    noChance: 82,
    volume: "$67.8K",
    timeLeft: "12h 45m",
    isNew: true,
  },
];

export const recentActivity = [
  {
    user: "CryptoProphet",
    action: "yes",
    actionType: "buy",
    market: "BTC $100K",
    amount: "$250",
    timestamp: Date.now() - 120000,
  },
  {
    user: "BlockchainBull",
    action: "no",
    actionType: "sell",
    market: "ETH Staking",
    amount: "$150",
    timestamp: Date.now() - 240000,
  },
  {
    user: "DeFiDegen",
    action: "yes",
    actionType: "buy",
    market: "Exchange Hack",
    amount: "$500",
    timestamp: Date.now() - 360000,
  },
];

export const recentTransactions = [
  {
    id: "t1",
    trader: "Tim",
    amount: "$2",
    type: "buy",
    market: "yes",
    timestamp: Date.now() - 120000,
  },
  {
    id: "t2",
    trader: "GOFerb",
    amount: "$10",
    type: "sell",
    market: "no",
    timestamp: Date.now() - 240000,
  },
  {
    id: "t3",
    trader: "Satoshi",
    amount: "$5",
    type: "buy",
    market: "yes",
    timestamp: Date.now() - 360000,
  },
  {
    id: "t4",
    trader: "Alice",
    amount: "$7",
    type: "sell",
    market: "no",
    timestamp: Date.now() - 480000,
  },
];
