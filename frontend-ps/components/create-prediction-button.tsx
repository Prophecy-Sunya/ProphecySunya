"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import { useDisclosure } from "@heroui/react";
import { CreatePredictionModal } from "./create-prediction-modal";

const CreatePredictionButton = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button
        size="lg"
        className="text-lg font-semibold px-8"
        startContent={<PlusIcon className="w-5 h-5" />}
        onPress={onOpen}
      >
        Create Prediction
      </Button>
      {/* The modal for creating a prediction */}
      <CreatePredictionModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
};

export default CreatePredictionButton;
