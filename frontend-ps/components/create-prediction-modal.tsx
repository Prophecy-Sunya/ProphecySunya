"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
} from "@heroui/react";
import {
  CalendarIcon,
  ChevronDownIcon,
  ClockIcon,
  DocumentTextIcon,
  PlusIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

interface CreatePredictionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  { key: "technology", label: "Technology" },
  { key: "finance", label: "Finance" },
  { key: "sports", label: "Sports" },
  { key: "politics", label: "Politics" },
  { key: "entertainment", label: "Entertainment" },
  { key: "science", label: "Science" },
  { key: "crypto", label: "Cryptocurrency" },
  { key: "climate", label: "Climate" },
  { key: "health", label: "Health" },
  { key: "other", label: "Other" },
];

const expirationOptions = [
  { key: "7", label: "7 days" },
  { key: "30", label: "30 days" },
  { key: "90", label: "90 days" },
  { key: "180", label: "180 days" },
  { key: "365", label: "1 year" },
];

export function CreatePredictionModal({
  isOpen,
  onOpenChange,
}: CreatePredictionModalProps) {
  const [formData, setFormData] = useState({
    content: "",
    category: "",
    expirationDays: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showExpirationDropdown, setShowExpirationDropdown] = useState(false);

  const handleSubmit = async () => {
    if (!formData.content || !formData.category || !formData.expirationDays) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Creating prediction:", formData);

    // Reset form
    setFormData({
      content: "",
      category: "",
      expirationDays: "",
    });

    setIsLoading(false);
    onOpenChange(false);
  };

  const isFormValid =
    formData.content && formData.category && formData.expirationDays;

  const getCategoryLabel = () => {
    const category = categories.find((c) => c.key === formData.category);
    return category ? category.label : "Select a category";
  };

  const getExpirationLabel = () => {
    const expiration = expirationOptions.find(
      (e) => e.key === formData.expirationDays,
    );
    return expiration ? expiration.label : "Select expiration time";
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      placement="center"
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
              <div className="flex items-center gap-2">
                <PlusIcon className="w-6 h-6 text-warning" />
                <h2 className="text-2xl font-bold">Create New Prediction</h2>
              </div>
              <p className="text-default-500 text-sm font-normal">
                Share your prediction and let the community verify its outcome
              </p>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {/* Prediction Content */}
                <div className="space-y-2">
                  <label className=" font-medium flex items-center gap-2">
                    <DocumentTextIcon className="w-4 h-4 text-warning" />
                    Prediction Content
                  </label>
                  <Textarea
                    placeholder="Enter your prediction here... (e.g., 'Bitcoin will reach $200,000 by the end of 2025')"
                    value={formData.content}
                    onValueChange={(value) =>
                      setFormData({ ...formData, content: value })
                    }
                    classNames={{
                      input: "placeholder:text-default-500",
                      inputWrapper:
                        "bg-default/30 border-default/80 hover:border-default/40 focus-within:border-warning focus-within:bg-default/30",
                    }}
                  />
                  <p className="text-xs text-default-500">
                    Be specific and clear about what you're predicting
                  </p>
                </div>

                {/* Category Selection */}
                <div className="space-y-2">
                  <label className=" font-medium flex items-center gap-2">
                    <TagIcon className="w-4 h-4 text-warning" />
                    Category
                  </label>
                  <div className="relative">
                    <Button
                      variant="bordered"
                      className="border-default/30 hover:bg-default/10 justify-between w-full"
                      endContent={<ChevronDownIcon className="w-4 h-4" />}
                      onPress={() =>
                        setShowCategoryDropdown(!showCategoryDropdown)
                      }
                    >
                      {getCategoryLabel()}
                    </Button>
                    {showCategoryDropdown && (
                      <div className="absolute top-full mt-2 w-full border border-default/40 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto bg-default-50">
                        {categories.map((category) => (
                          <button
                            key={category.key}
                            className="w-full px-4 py-2 text-left hover:bg-default/80 first:rounded-t-lg last:rounded-b-lg"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                category: category.key,
                              });
                              setShowCategoryDropdown(false);
                            }}
                          >
                            {category.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expiration Time */}
                <div className="space-y-2">
                  <label className=" font-medium flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-warning" />
                    Expiration Time
                  </label>
                  <div className="relative">
                    <Button
                      variant="bordered"
                      className="w-full border-default/30 hover:bg-default/10 justify-between"
                      endContent={<ChevronDownIcon className="w-4 h-4" />}
                      onPress={() =>
                        setShowExpirationDropdown(!showExpirationDropdown)
                      }
                    >
                      {getExpirationLabel()}
                    </Button>
                    {showExpirationDropdown && (
                      <div className="absolute top-full mt-2 w-full border border-default/40 rounded-lg shadow-lg z-10 max-h-52 overflow-y-auto bg-default-50">
                        {expirationOptions.map((option) => (
                          <button
                            key={option.key}
                            className="w-full px-4 py-2 text-left hover:bg-default/80 first:rounded-t-lg last:rounded-b-lg"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                expirationDays: option.key,
                              });
                              setShowExpirationDropdown(false);
                            }}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-default-500">
                    Choose when this prediction should be resolved
                  </p>
                </div>

                {/* Info Box */}
                <div className="bg-purple-500/10 border border-warning/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className=" font-medium mb-1">How it works</h4>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        After creating your prediction, the community can verify
                        its outcome when it expires. Verified predictions can be
                        minted as NFTs to commemorate accurate forecasts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="bordered"
                onPress={onClose}
                className="border-default/20  hover:bg-default/10"
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r  from-pink-500 to-yellow-500 shadow-lg font-semibold disabled:opacity-50"
                onPress={handleSubmit}
                isLoading={isLoading}
                isDisabled={!isFormValid}
              >
                {isLoading ? "Creating..." : "Create Prediction"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
