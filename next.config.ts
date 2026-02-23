import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Fix workspace root detection — parent package-lock.json causes false detection
  outputFileTracingRoot: path.resolve(__dirname),

  // Mark server-only native packages so Next.js doesn't bundle them
  serverExternalPackages: [
    "better-sqlite3",
    "@0glabs/0g-ts-sdk",
    "@0glabs/0g-serving-broker",
  ],

  // Ensure the native better-sqlite3 binary is included in the serverless bundle
  outputFileTracingIncludes: {
    "/api/**": ["./node_modules/better-sqlite3/**"],
  },

  webpack(config) {
    // MetaMask SDK pulls in @react-native-async-storage (React Native only).
    // WalletConnect's pino logger pulls in pino-pretty (server dev tool only).
    // Both are optional at runtime in a browser context — stub them out so
    // webpack doesn't hang trying to resolve them (was causing 200s+ compiles).
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "@react-native-async-storage/async-storage": false,
      "pino-pretty": false,
      "lokijs": false,
      "encoding": false,
    };
    return config;
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
