import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for development best practices
  reactStrictMode: true,

  // Image optimization: allow local uploads and common external sources
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    // Local uploads volume served from /public/uploads
    localPatterns: [
      {
        pathname: "/uploads/**",
      },
    ],
  },

  // Experimental: server actions are enabled by default in Next.js 14+/15+
  // No extra config needed for App Router server actions

  // Webpack: allow SCSS modules to use @use and @forward
  sassOptions: {
    // Make design token partials available everywhere without explicit imports
    // (will be set up in Phase 2 when design tokens are created)
  },
};

export default nextConfig;
