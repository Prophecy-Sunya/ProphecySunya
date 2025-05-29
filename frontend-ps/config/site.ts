export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "ProphecySunya",
  description: "Decentralized Prediction Markets on Starknet",
  navItems: [
    { label: "Home", href: "/home" },
    { label: "Markets", href: "/markets" },
    {
      label: "Predictions",
      href: "/predictions",
    },
    {
      label: "NFTs",
      href: "/nfts",
    },
    {
      label: "Governance",
      href: "/governances",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  footerNavItems: [
    {
      label: "Privacy Policy",
      href: "/privacy-policy",
    },
    {
      label: "Terms of Service",
      href: "/terms-of-service",
    },
    {
      label: "Contact Us",
      href: "/contact-us",
    },
    {
      label: "About Us",
      href: "/about-us",
    },
    {
      label: "FAQ",
      href: "/faq",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
