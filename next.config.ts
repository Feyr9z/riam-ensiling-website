import type { NextConfig } from "next";
import path from "path";
import { pathToFileURL } from "url";

// Generates a Sass-safe file:// URL that works on Windows and Linux/macOS.
// Dart Sass understands file:// URLs natively; absolute Win32 paths (C:\...) do not work.
function sassFileUrl(absPath: string): string {
  return pathToFileURL(path.resolve(absPath)).href;
}

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
      `@use "${sassFileUrl("src/styles/_variables")}" as *;`,
      `@use "${sassFileUrl("src/styles/_mixins")}" as *;`,
    ].join("\n") + "\n",
  },
};

export default nextConfig;
