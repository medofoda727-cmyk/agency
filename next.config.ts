import type { NextConfig } from "next";

/**
 * Static export: `npm run build` produces a fully static site in /out
 * that can be hosted anywhere (Netlify, Vercel, Cloudflare Pages, cPanel…).
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  experimental: {
    globalNotFound: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
