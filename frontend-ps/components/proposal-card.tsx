"use client";

import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Progress,
  Avatar,
} from "@heroui/react";
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  UsersIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface Proposal {
  id: string;
  description: string;
  creator: string;
  startTime: number;
  endTime: number;
  status: "ACTIVE" | "PASSED" | "FAILED" | "PENDING";
  yesVotes: number;
  noVotes: number;
}

interface ProposalCardProps {
  proposal: Proposal;
}

export function ProposalCard({ proposal }: ProposalCardProps) {
  const totalVotes = proposal.yesVotes + proposal.noVotes;
  const yesPercentage =
    totalVotes > 0 ? (proposal.yesVotes / totalVotes) * 100 : 0;
  const noPercentage =
    totalVotes > 0 ? (proposal.noVotes / totalVotes) * 100 : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-success/20 text-success border-success/30";
      case "PASSED":
        return "bg-primary/20 text-primary border-primary/30";
      case "FAILED":
        return "bg-danger-500/20 text-danger-200 border-danger-400/30";
      case "PENDING":
        return "bg-warning-500/20 text-warning-200 border-warning-400/30";
      default:
        return "bg-default/20  border-default/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <ClockIcon className="w-4 h-4" />;
      case "PASSED":
        return <CheckCircleIcon className="w-4 h-4" />;
      case "FAILED":
        return <XCircleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTimeRemaining = () => {
    const now = Date.now();
    const timeLeft = proposal.endTime - now;

    if (timeLeft <= 0) return "Voting ended";

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );

    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const isActive = proposal.status === "ACTIVE";
  const hasVoted = false; // This would come from user state

  return (
    <Card className="bg-default/30 backdrop-blur-md border border-default/10 hover:border-default/20 transition-all duration-300 hover:shadow-xl">
      <CardBody className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold  mb-2 leading-tight">
                {proposal.description}
              </h3>
              <div className="flex items-center gap-2 text-sm text-default-600">
                <Avatar
                  size="sm"
                  src="/placeholder.svg?height=24&width=24"
                  className="w-5 h-5"
                />
                <span>
                  by {proposal.creator.slice(0, 6)}...
                  {proposal.creator.slice(-4)}
                </span>
              </div>
            </div>
            <Chip
              size="sm"
              variant="flat"
              className={getStatusColor(proposal.status)}
              startContent={getStatusIcon(proposal.status)}
            >
              {proposal.status}
            </Chip>
          </div>

          {/* Voting Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-default-600">Voting Progress</span>
              <span className="text-sm  font-medium">{totalVotes} votes</span>
            </div>

            <div className="space-y-2">
              {/* Yes votes */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-success" />
                  <span className="text-sm ">Yes</span>
                </div>
                <span className="text-sm  font-medium">
                  {proposal.yesVotes} ({yesPercentage.toFixed(1)}%)
                </span>
              </div>
              <Progress
                value={yesPercentage}
                className="h-2"
                classNames={{
                  track: "bg-default/10",
                  indicator: "bg-gradient-to-r from-success-700 to-success-500",
                }}
              />

              {/* No votes */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircleIcon className="w-4 h-4 text-danger" />
                  <span className="text-sm ">No</span>
                </div>
                <span className="text-sm  font-medium">
                  {proposal.noVotes} ({noPercentage.toFixed(1)}%)
                </span>
              </div>
              <Progress
                value={noPercentage}
                className="h-2"
                classNames={{
                  track: "bg-default/10",
                  indicator: "bg-gradient-to-r from-danger-700 to-danger-500",
                }}
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="flex flex-col items-center justify-between text-sm">
            <div className="flex items-center gap-2 ">
              <CalendarIcon className="w-4 h-4" />
              <span>Started: {formatDate(proposal.startTime)}</span>
            </div>
            <div className="flex items-center gap-2 ">
              <ClockIcon className="w-4 h-4" />
              <span>Ends: {formatDate(proposal.endTime)}</span>
            </div>
          </div>

          {/* Time remaining */}
          <div className="text-center">
            <Chip
              size="sm"
              variant="flat"
              className="bg-default/40 text-default-800 p-2.5 border border-default/30"
              startContent={<ClockIcon className="w-4 h-4" />}
            >
              {getTimeRemaining()}
            </Chip>
          </div>
        </div>
      </CardBody>

      <CardFooter className="px-6 pb-6 pt-0">
        {isActive ? (
          <div className="flex gap-3 w-full justify-between">
            <Button
              className="flex-1 bg-gradient-to-r from-success-500 to-success-600  font-semibold hover:from-success-600 hover:to-success-700"
              size="sm"
              startContent={<CheckCircleIcon className="w-4 h-4" />}
              disabled={hasVoted}
            >
              Vote Yes
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-danger-500 to-danger-600  font-semibold hover:from-danger-600 hover:to-danger-700"
              size="sm"
              startContent={<XCircleIcon className="w-4 h-4" />}
              disabled={hasVoted}
            >
              Vote No
            </Button>
          </div>
        ) : (
          <div className="flex gap-3 w-full justify-between">
            <Button
              variant="bordered"
              size="sm"
              startContent={<UsersIcon className="w-4 h-4" />}
            >
              View Details
            </Button>
            <Button variant="bordered" size="sm">
              Discussion
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
