import type { NextConfig } from "next";
import path from "path";

const formatSassPath = (filePath: string) => path.resolve(filePath).replace(/\\/g, "/");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  sassOptions: {
    additionalData: [
      `@use "${formatSassPath("src/styles/_variables")}" as *;`,
      `@use "${formatSassPath("src/styles/_mixins")}" as *;`,
    ].join("\n") + "\n",
  },
};

export default nextConfig;
