import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lakshiraah.com" }, // product images hosted on main domain
    ],
  },
};

export default nextConfig;
