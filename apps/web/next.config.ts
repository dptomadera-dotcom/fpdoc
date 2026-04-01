import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",          // Exportación estática para GitHub Pages
  trailingSlash: true,       // Necesario para rutas en GitHub Pages
  basePath: isProd ? "/TRANSVERSAL-FP" : "",   // Sub-ruta del repo
  assetPrefix: isProd ? "/TRANSVERSAL-FP/" : "", // Prefijo para assets
  images: {
    unoptimized: true,       // Obligatorio en modo static export
  },
};

export default nextConfig;
