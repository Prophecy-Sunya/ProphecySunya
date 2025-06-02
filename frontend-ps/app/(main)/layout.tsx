"use client";

import SpinnerScreen from "@/components/spinner-screen";
import { addToast } from "@heroui/react";
import { useAccount } from "@starknet-react/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.replace("/");
      addToast({
        title: "Wallet not connected",
        description: "Please connect your wallet to access the app.",
        color: "warning",
      });
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return <SpinnerScreen />;
  }

  return <>{children}</>;
}
