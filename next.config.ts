import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/**",
      },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "www.jaegerlongevity.com" },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
