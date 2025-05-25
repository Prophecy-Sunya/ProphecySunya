"use client";

import { timeUntilExpiration } from "@/utils/helpers";
import {
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  CheckBadgeIcon,
  HeartIcon,
  ShoppingCartIcon,
  TagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
  image,
  Tooltip,
  Avatar,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import Image from "next/image";
import { useState } from "react";

interface NftCardProps {
  id: string;
  predictionContent: string;
  category: string;
  prophetScore: number;
  creationTime: number;
  imageUrl: string;
  price: number;
  creator: string;
  metadata?: NFTMetadata;
}

interface NFTMetadata {
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  description: string;
  owner: string;
  contractAddress: string;
  tokenId: string;
  blockchain: string;
  createdDate: string;
  lastSale?: {
    price: string;
    currency: string;
    date: string;
  };
}

const NftCard = ({
  predictionContent,
  category,
  creationTime,
  prophetScore,
  imageUrl,
  price,
  creator,
}: NftCardProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [liked, setLiked] = useState(false);

  // Mock metadata for demonstration
  const mockMetadata: NFTMetadata = {
    attributes: [
      { trait_type: "Background", value: "Cosmic Purple" },
      { trait_type: "Eyes", value: "Laser" },
      { trait_type: "Mouth", value: "Smile" },
      { trait_type: "Accessory", value: "Crown" },
      { trait_type: "Rarity Score", value: 8.5 },
    ],
    description:
      "A unique digital collectible from the cosmic dreams series. This NFT represents the intersection of art and technology, featuring hand-crafted details and algorithmic generation.",
    owner: "0x742d35Cc6634C0532925a3b8D4C2C4e4C8b4C8b4",
    contractAddress: "0x123...789",
    tokenId: "1234",
    blockchain: "Ethereum",
    createdDate: "2023-12-15",
    lastSale: {
      price: "1.8",
      currency: "ETH",
      date: "2023-12-20",
    },
  };
  const handleLike = () => {
    setLiked(!liked);
  };
  return (
    <>
      <Card
        className="max-w-[400px]  bg-default/30 backdrop-blur-md  transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
        // isHoverable={true}
      >
        <CardBody className="p-0">
          <div
            className="relative overflow-hidden cursor-pointer"
            onClick={onOpen}
          >
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={`nft for prediction: ${predictionContent}`}
              width={400}
              height={400}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
            />

            {/* Category type */}
            <div className="absolute top-3 left-3">
              <Chip size="sm" variant="flat" className="text-xs ">
                {category}
              </Chip>
            </div>

            {/* Prophet Score */}
            <div className="absolute top-3 right-3">
              <Chip size="sm" variant="flat" className="text-xs ">
                Prophet Score: {prophetScore}%
              </Chip>
            </div>

            {/* Like button */}
            <div className="absolute bottom-3 right-3">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                className="bg-default/20 hover:bg-red-500/30 hover:text-red-200"
              >
                <HeartIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Prediction content and creator */}
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold  line-clamp-2">
                  {predictionContent}
                </h3>
                {/* <p className="text-sm text-gray-300">{collection}</p> */}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar
                  size="sm"
                  src="/placeholder.svg?height=32&width=32"
                  className="w-6 h-6"
                />
                <span className="text-sm text-default-600-600">{creator}</span>
                {/* verified creator  */}
                <Tooltip content="Verified">
                  <CheckBadgeIcon className="w-4 h-4 text-blue-600" />
                </Tooltip>
              </div>

              <div className="text-right">
                <p className="text-xs text-default-600-600">Current Price</p>
                <p className="text-lg font-bold ">
                  {price}{" "}
                  <span className="text-sm text-default-600-600">ETH</span>
                </p>
              </div>
            </div>
          </div>
        </CardBody>
        <CardFooter className="px-4 pb-4 pt-0">
          <div className="flex gap-2 w-full">
            <Button
              className="flex-1 bg-gradient-to-tr from-pink-500 to-yellow-500 shadow-lg transition-transform duration-200 ease-in-out hover:scale-105"
              size="sm"
            >
              Buy Now
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* NFT Metadata Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        size="4xl"
        backdrop="blur"
        scrollBehavior="inside"
        classNames={{
          base: "bg-default/60 border border-default/50",
          header: "border-b border-default/50",
          body: "py-6",
          footer: "border-t border-default/50",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 ">
                <h2 className="text-2xl font-bold">{predictionContent}</h2>
                {/* <p className=" text-sm">{nft.collection}</p> */}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image */}
                  <div className="space-y-4">
                    <Image
                      src={imageUrl || "/placeholder.svg"}
                      alt={`nft for prediction: ${predictionContent}`}
                      width={400}
                      height={400}
                      className="w-full rounded-lg"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="bordered"
                        size="sm"
                        startContent={
                          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        }
                        className="border-default/20 hover:bg-default/10"
                      >
                        View on OpenSea
                      </Button>
                      <Button
                        variant="bordered"
                        size="sm"
                        startContent={
                          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        }
                        className="border-default/20 hover:bg-default/10"
                      >
                        Etherscan
                      </Button>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Description
                      </h3>
                      <p className="text-sm leading-relaxed">
                        {mockMetadata.description}
                      </p>
                    </div>

                    {/* Details */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Details</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <UserIcon className="w-4 h-4 " />
                          <span>Owner:</span>
                          <span className="font-mono">
                            {mockMetadata.owner.slice(0, 10)}...
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <TagIcon className="w-4 h-4 " />
                          <span>Token ID:</span>
                          <span>{mockMetadata.tokenId}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarIcon className="w-4 h-4 " />
                          <span>Created:</span>
                          <span>{mockMetadata.createdDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <ArrowTopRightOnSquareIcon className="w-4 h-4 " />
                          <span>Blockchain:</span>
                          <span>{mockMetadata.blockchain}</span>
                        </div>
                      </div>
                    </div>

                    {/* Attributes */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Attributes</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {mockMetadata.attributes.map((attr, index) => (
                          <div
                            key={index}
                            className="bg-default/30 rounded-lg p-3 border border-default/50"
                          >
                            <p className="text-xs  uppercase tracking-wide">
                              {attr.trait_type}
                            </p>
                            <p className="font-semibold">{attr.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Last Sale */}
                    {mockMetadata.lastSale && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Last Sale
                        </h3>
                        <div className="bg-default/30 rounded-lg p-3 border border-default/50">
                          <p className="text-2xl font-bold ">
                            {mockMetadata.lastSale.price}{" "}
                            {mockMetadata.lastSale.currency}
                          </p>
                          <p className="text-sm ">
                            {mockMetadata.lastSale.date}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="bordered" onPress={onClose}>
                  Close
                </Button>
                <Button
                  className="bg-gradient-to-r  from-pink-500 to-yellow-500 shadow-lg transition-transform duration-200 ease-in-out hover:scale-105"
                  onPress={onClose}
                >
                  Make Offer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default NftCard;
