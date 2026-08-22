import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Enable React strict mode for development best practices
  reactStrictMode: true,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },

  // SCSS configuration
  sassOptions: {
    // Automatically inject variables and mixins into every SCSS Module file
    // so components don't need to manually @use them.
    // IMPORTANT: _variables.scss and _mixins.scss must produce ZERO CSS output.
    additionalData: [
      `@use "${path.resolve("src/styles/_variables")}" as *;`,
      `@use "${path.resolve("src/styles/_mixins")}" as *;`,
    ].join("\n") + "\n",
  },
};

export default nextConfig;
