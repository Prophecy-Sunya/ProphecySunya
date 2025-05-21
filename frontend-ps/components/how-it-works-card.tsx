"use client";
import type { ComponentType, SVGProps } from "react";
import { Card, CardBody, CardHeader, Chip } from "@heroui/react";

type HeroIcon = ComponentType<SVGProps<SVGSVGElement>>;

interface HowItWorksCardProps {
  name: string;
  description: string;
  Icon: HeroIcon;
}

const HowItWorksCard = ({ name, description, Icon }: HowItWorksCardProps) => {
  return (
    <Card className="max-w-[400px] p-4 flex flex-col" isHoverable={true}>
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <div className="flex  gap-2 items-start justify-center">
            <Icon className="h-8 w-8 text-yellow-500" />
            <p className="font-semibold text-xl">{name}</p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-3 py-0 text-medium text-default-600">
        <span className="pt-2 ">{description}</span>
      </CardBody>
    </Card>
  );
};

export default HowItWorksCard;
