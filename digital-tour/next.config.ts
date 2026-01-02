import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: true,
  swcMinify: true,

  images: {
    // Add your domains here if needed
  },

  // Any other config you had
};

export default nextConfig;
