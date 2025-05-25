"use client";

import { timeUntilExpiration } from "@/utils/helpers";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
} from "@heroui/react";

interface PredictionCardProps {
  id: string;
  content: string;
  category: string;
  creator: string;
  expirationTime: number;
  verificationStatus: string;
}

const PredictionCard = ({
  content,
  category,
  creator,
  expirationTime,
  verificationStatus,
}: PredictionCardProps) => {
  return (
    <Card
      className="max-w-[400px]  bg-default/30 backdrop-blur-md  transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
      isHoverable={true}
    >
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <div className="flex  gap-2 items-start justify-center">
            <Chip color="primary" variant="faded">
              {category}
            </Chip>
            <Chip
              color={
                verificationStatus === "VERIFIED_TRUE" ? "success" : "warning"
              }
              variant="faded"
            >
              {verificationStatus.toLowerCase()}
            </Chip>
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-600">
        <p className="font-semibold text-xl">{content}</p>
        <span className="pt-2 ">
          Created by: {creator.substring(0, 6)}...
          {creator.substring(creator.length - 4)}
        </span>
        <span className="pt-2">
          Expires: {timeUntilExpiration(expirationTime)}
        </span>
      </CardBody>
      <CardFooter className="gap-3">
        <Button variant="bordered" fullWidth={true}>
          View Details
        </Button>
        {verificationStatus === "VERIFIED_TRUE" ? (
          <Button variant="bordered" color="secondary" fullWidth={true}>
            Mint NFT
          </Button>
        ) : (
          <>
            <Button variant="bordered" color="success" fullWidth={true}>
              Verify True
            </Button>
            <Button variant="bordered" color="danger" fullWidth={true}>
              Verify False
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default PredictionCard;
