import type { NextConfig } from "next";

export const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb", // Set this to your MAX_FILE_SIZE
    },
  },
};

export default nextConfig;
