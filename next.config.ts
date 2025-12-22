import type { NextConfig } from "next";

export const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb", // Set this to your MAX_FILE_SIZE
    },
  },
  api: {
    bodyParser: false,
  },
};

export default nextConfig;
