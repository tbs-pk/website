import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 
   * Vercel supports Image Optimization by default.
   * We enable it for optimal performance.
   */
  images: {
    // unoptimized: true, // Commented out to enable Vercel Image Optimization
  },
};

export default nextConfig;
