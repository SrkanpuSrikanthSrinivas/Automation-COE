import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Content lives in /content and is read at build time, so every page is static
  // and served from Vercel's edge cache. Add remote image hosts here when needed.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "avatars.githubusercontent.com" }],
  },
  poweredByHeader: false,
};

export default nextConfig;
