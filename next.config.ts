import type { NextConfig } from "next";

const nextConfig = {
  devIndicators: false,

  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    disableDevOverlay: true,
  },
} as unknown as NextConfig;

export default nextConfig;