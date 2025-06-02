/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    //   domains: ["cdn.pixabay.com", "images.pexels.com", "starknet.id"],
    // },
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "starknet.id",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
