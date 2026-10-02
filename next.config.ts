import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Unsplash and our pre-optimized webp files are already served from CDNs at the
  // right size, so a custom loader sizes them directly instead of re-encoding.
  images: { loader: "custom", loaderFile: "./src/lib/image-loader.ts" },
};

export default nextConfig;
