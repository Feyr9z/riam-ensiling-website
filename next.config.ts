import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",

  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.1.4"],

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
    // loadPaths tells Dart Sass where to look for files when resolving @use.
    // This avoids all absolute path issues on Windows/Linux/macOS.
    loadPaths: [path.resolve(__dirname, "src/styles")],
    additionalData: `@use "variables" as *;\n@use "mixins" as *;\n`,
  },
};

export default nextConfig;
