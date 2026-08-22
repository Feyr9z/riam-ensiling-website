import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },

  sassOptions: {
    additionalData: [
      `@use "${path.resolve("src/styles/_variables")}" as *;`,
      `@use "${path.resolve("src/styles/_mixins")}" as *;`,
    ].join("\n") + "\n",
  },
};

export default nextConfig;
