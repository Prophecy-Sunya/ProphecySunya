"use client";

import { useStoreWallet } from "@/stores/wallet-store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

/**
 * This is a client component responsible for accessing the wallet store
 * and logging its connection status and address. It's marked with
 * 'use client' to ensure it runs in the browser environment.
 * It wraps around the main layout of the application to provide
 * access to the wallet state.
 */

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  // Access the wallet store using the client-side hook
  const { isConnected, address } = useStoreWallet((state) => state);
  const router = useRouter(); // Initialize the router
  const pathname = usePathname(); // Get the current pathname
  console.log(
    "Wallet connected (from MainLayoutWrapper):",
    isConnected,
    "Address:",
    address,
  );

  // Use useEffect to handle redirection logic after component mounts and state changes
  useEffect(() => {
    // Define your landing page path and the default path for connected users
    const LANDING_PAGE_PATH = "/";
    const CONNECTED_DEFAULT_PATH = "/home";
    if (isConnected) {
      // If the wallet is connected
      // And the user is currently on the landing page, redirect to the main app's default path
      if (pathname === LANDING_PAGE_PATH) {
        router.push(CONNECTED_DEFAULT_PATH);
      }
      // If connected and not on landing page, stay on the current page (children will render it)
    } else {
      // If the wallet is NOT connected
      // And the user is currently NOT on the landing page, redirect to the landing page
      if (pathname !== LANDING_PAGE_PATH) {
        router.push(LANDING_PAGE_PATH);
      }
      // If not connected and already on landing page, stay on landing page (children will render it)
    }
  }, [isConnected, pathname, router]); // Dependencies: re-run effect if these values change

  return (
    <div className="relative flex flex-col min-h-screen z-10">
      <Navbar isConnected={isConnected} walletAddress={address} />

      <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
}
