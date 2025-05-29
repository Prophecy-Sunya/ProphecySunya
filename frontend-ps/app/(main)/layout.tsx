"use client";

import { WalletErrorBoundary } from "@/components/main-layout-wrapper";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WalletErrorBoundary>{children}</WalletErrorBoundary>;
}
