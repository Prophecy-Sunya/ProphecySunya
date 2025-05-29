import "@/styles/globals.css";
import clsx from "clsx";
import { Metadata, Viewport } from "next";

import { Providers } from "./providers";

import { MainLayoutWrapper } from "@/components/main-layout-wrapper";
import { fontSans } from "@/config/fonts";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

/**
 * RootLayout Component
 *
 * This is the top-level Server Component for your Next.js application.
 * It sets up the basic HTML structure, global styles, theme providers,
 * and handles hydration for Zustand stores.
 *
 * It delegates the conditional rendering of the main application layout
 * versus the landing page to the `ClientLayoutWrapper` based on wallet connection status.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen font-sans relative antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          {/*
            The ClientLayoutWrapper will now handle the conditional rendering
            of the Navbar, main content, and Footer based on wallet connection.
            It receives the 'children' (your page content, including the landing page)
            from this RootLayout.
          */}
          <MainLayoutWrapper>{children}</MainLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
