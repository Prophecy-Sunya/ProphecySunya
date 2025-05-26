"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Accordion,
  AccordionItem,
  Chip,
} from "@heroui/react";
import {
  ChatBubbleOvalLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EnvelopeIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "trading" | "technical" | "governance";
}

const faqData: FAQItem[] = [
  {
    id: "1",
    question: "What is ProphecySunya?",
    answer:
      "ProphecySunya is a decentralized prediction market platform built on Starknet that allows users to create predictions, verify outcomes through AI oracles, mint NFTs for verified predictions, and participate in governance.",
    category: "general",
  },
  {
    id: "2",
    question: "How do I create a prediction?",
    answer:
      'To create a prediction, you need to connect your Starknet wallet, navigate to the home page, click on "Create Prediction", and fill out the prediction details including content, category, and expiration time.',
    category: "trading",
  },
  {
    id: "3",
    question: "How are predictions verified?",
    answer:
      "Predictions are verified through our AI oracle system, which analyzes real-world data to determine the outcome of a prediction. The verification process is transparent and can be challenged through our governance system if needed.",
    category: "technical",
  },
  {
    id: "4",
    question: "What are Prophet NFTs?",
    answer:
      "Prophet NFTs are non-fungible tokens that represent verified predictions. When your prediction is verified as true, you can mint an NFT that showcases your successful prediction. These NFTs also contribute to your Prophet Score, which determines your influence in the governance system.",
    category: "trading",
  },
  {
    id: "5",
    question: "What is the Prophet Score?",
    answer:
      "The Prophet Score is a measure of your prediction accuracy and participation in the platform. A higher Prophet Score gives you more influence in the governance system and can unlock additional features and benefits.",
    category: "governance",
  },
  {
    id: "6",
    question: "How does the governance system work?",
    answer:
      "The governance system allows users to propose and vote on changes to the platform. Your voting power is determined by your Prophet Score. Proposals can include parameter changes, feature additions, or other platform modifications.",
    category: "governance",
  },
  {
    id: "7",
    question: "What is the Gas Tank?",
    answer:
      "The Gas Tank is a feature that allows for transaction sponsorship and meta-transactions. This means that certain actions on the platform can be performed without paying gas fees directly, making the platform more accessible to new users.",
    category: "technical",
  },
  {
    id: "8",
    question: "How does cross-chain bridging work?",
    answer:
      "Cross-chain bridging allows predictions to be created on one blockchain and verified on another. This feature is still in development and will be available in a future release.",
    category: "technical",
  },
];

const categories = [
  { key: "all", label: "All Questions" },
  { key: "general", label: "General" },
  { key: "trading", label: "Trading" },
  { key: "technical", label: "Technical" },
  { key: "governance", label: "Governance" },
];

export function FAQs() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const itemClasses = {
    base: "py-0 w-full",
    title: "text-lg",
    trigger:
      "px-2 py-0 data-[hover=true]:bg-default/30 rounded-lg h-14 flex items-center",
    indicator: "text-lg",
    content: "px-2",
  };

  const filteredFAQs =
    selectedCategory === "all"
      ? faqData
      : faqData.filter((faq) => faq.category === selectedCategory);

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Chip variant="bordered" className="mb-4">
          <div className="flex items-center font-semibold">
            <QuestionMarkCircleIcon className="mr-1 h-3 w-3" />
            <span>FAQs</span>
          </div>
        </Chip>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground text-lg">
          Have questions about ProphecySunya? Here are some of the most common
          queries answered to help you get started.
        </p>
      </div>
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((category) => {
          return (
            <Button
              key={category.key}
              variant={selectedCategory === category.key ? "solid" : "bordered"}
              className={`
                  ${
                    selectedCategory === category.key
                      ? "bg-default/80 border-default/80 "
                      : "border-default/30  hover:bg-default/80"
                  }
                `}
              onPress={() => setSelectedCategory(category.key)}
            >
              {category.label}
            </Button>
          );
        })}
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQs.map((faq) => (
          <Accordion key={faq.id} className="" itemClasses={itemClasses}>
            <AccordionItem
              key={faq.id}
              aria-label={faq.question}
              title={faq.question}
            >
              <div className="break-words break-all text-default-500">
                {faq.answer}
              </div>
            </AccordionItem>
          </Accordion>
        ))}
      </div>

      {/* Contact Section */}
      {/* <div className="mt-16 text-center">
        <div className="bg-default/30 backdrop-blur-md border border-default/10 rounded-2xl p-8 max-w-2xl mx-auto">
          <QuestionMarkCircleIcon className="w-12 h-12 text-warning mx-auto mb-4" />
          <h3 className="text-2xl font-bold  mb-2">Still have questions?</h3>
          <p className="text-default-600 mb-6">
            Can't find the answer you're looking for? Our support team is here
            to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-gradient-to-r from-pink-500 to-yellow-500 font-semibold hover:from-pink-600 hover:to-yellow-600 transition-colors"
              startContent={<ChatBubbleOvalLeftIcon className="w-4 h-4" />}
            >
              Contact Support
            </Button>
            <Button
              variant="bordered"
              className=" hover:bg-default/40"
              startContent={<EnvelopeIcon className="w-4 h-4" />}
            >
              Email Us
            </Button>
          </div>
        </div>
      </div> */}
    </section>
  );
}
