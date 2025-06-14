"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useEffect, useState, useCallback } from "react";

import { Navbar } from "./navbar";
import { Footer } from "./footer";

import { useAccount } from "@starknet-react/core";
import { Spinner } from "@heroui/react";
import SpinnerScreen from "./spinner-screen";

// Route configuration - keep in sync with middleware
const ROUTES = {
  LANDING: "/",
  HOME: "/home",
  PROTECTED_ROUTES: ["/home", "/governance", "/markets"],
} as const;

// Cookie helpers (kept as is, but consider a separate utility file)
const setWalletConnectionCookie = (address: string) => {
  if (typeof document !== "undefined") {
    document.cookie = `wallet-connected=true; path=/; max-age=86400; SameSite=Strict`;
    document.cookie = `wallet-address=${address}; path=/; max-age=86400; SameSite=Strict`;
  }
};

const clearWalletConnectionCookie = () => {
  if (typeof document !== "undefined") {
    document.cookie = `wallet-connected=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `wallet-address=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isConnected, address, isConnecting, isReconnecting } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [authState, setAuthState] = useState<
    "initial" | "checking" | "authorized"
  >("initial");

  const isProtectedRoute = useCallback((path: string): boolean => {
    return ROUTES.PROTECTED_ROUTES.some((route) => path.startsWith(route));
  }, []);

  const isLandingPage = pathname === ROUTES.LANDING;
  const needsProtection = isProtectedRoute(pathname);

  // Sync wallet cookies (as before)
  useEffect(() => {
    if (isConnected && address) {
      setWalletConnectionCookie(address);
    } else if (!isConnecting && !isReconnecting) {
      clearWalletConnectionCookie();
    }
  }, [isConnected, address, isConnecting, isReconnecting]);

  useEffect(() => {
    // Determine if the wallet connection state is still being established
    const isWalletStatusPending = isConnecting || isReconnecting;

    // Phase 1: Always prioritize checking state if wallet status is pending.
    // Also, if we just started (initial) and the wallet status is not yet stable, go to checking.
    if (
      isWalletStatusPending ||
      (authState === "initial" && !isConnected && !address)
    ) {
      setAuthState("checking");
      return; // Wait for connection status to be determined
    }

    // After wallet connection state is settled (not connecting/reconnecting)
    const redirectTo = searchParams.get("redirect");

    // Phase 2: Handle redirects based on connection status and route type
    if (needsProtection) {
      if (!isConnected) {
        // User is on a protected route but not connected (client-side detected)
        if (pathname !== ROUTES.LANDING) {
          setAuthState("checking"); // Remain checking during redirect
          router.replace(
            `${ROUTES.LANDING}?redirect=${encodeURIComponent(pathname)}`,
          );
        } else {
          // Already on landing, and not connected, so landing is the target.
          setAuthState("authorized");
        }
        return;
      }
      // If needsProtection and isConnected, proceed to authorized
      setAuthState("authorized");
      return;
    }

    if (isLandingPage && isConnected) {
      // User is on the landing page and connected
      if (redirectTo && isProtectedRoute(decodeURIComponent(redirectTo))) {
        setAuthState("checking");
        router.replace(decodeURIComponent(redirectTo));
      } else if (pathname !== (ROUTES.HOME as string)) {
        setAuthState("checking");
        router.replace(ROUTES.HOME);
      } else {
        setAuthState("authorized"); // Already on home, no need to redirect
      }
      return;
    }

    // Phase 3: If no specific redirects or protection rules apply, authorize.
    setAuthState("authorized");

    // Clean up redirect param if it exists and we're on the target page
    if (redirectTo && decodeURIComponent(redirectTo) === pathname) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("redirect");
      router.replace(newUrl.pathname);
    }
  }, [
    isConnected,
    isConnecting,
    isReconnecting,
    address, // Added address to dependencies for more robust initial check
    pathname,
    searchParams,
    router,
    isProtectedRoute,
    isLandingPage,
    needsProtection,
    authState, // Include authState in dependencies if it changes the logic flow (careful with loops)
  ]);

  // Debug logging (as before)
  useEffect(() => {
    console.log("Auth State:", {
      authState,
      isConnected,
      isConnecting,
      isReconnecting,
      pathname,
      needsProtection,
      address: address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : "None",
    });
  }, [
    authState,
    isConnected,
    isConnecting,
    isReconnecting,
    pathname,
    needsProtection,
    address,
  ]);

  if (authState === "checking" || authState === "initial") {
    return <SpinnerScreen />;
  }

  return (
    <div className="relative flex flex-col min-h-screen z-10">
      <Navbar />
      <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
