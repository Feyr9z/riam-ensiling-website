import type { NextConfig } from "next";
import path from "path";

// Converts an absolute path to always use forward slashes (required for Turbopack + Dart Sass on Windows)
function toSassImportPath(segments: string[]): string {
  return path.resolve(...segments).split(path.sep).join("/");
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
      `@use "${toSassImportPath([__dirname, "src/styles/_variables"])}" as *;`,
      `@use "${toSassImportPath([__dirname, "src/styles/_mixins"])}" as *;`,
    ].join("\n") + "\n",
  },
};

export default nextConfig;
