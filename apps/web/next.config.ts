import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isProd ? "/TRANSVERSAL-FP" : "",
  assetPrefix: isProd ? "/TRANSVERSAL-FP/" : "",
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // ESLint se ejecuta por separado, no bloquea el build
  },
  typescript: {
    ignoreBuildErrors: true,  // TypeScript checks se hacen en CI aparte
  },
};

export default nextConfig;
