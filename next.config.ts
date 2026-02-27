import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",

  devIndicators: false,

  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    disableDevOverlay: true,
  },
}as unknown as NextConfig;

export default nextConfig;