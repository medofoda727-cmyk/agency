import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Foda Agency — للدعاية والإعلان",
    short_name: "Foda",
    description: "Creative advertising & media production agency — Damietta, Egypt.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090a",
    theme_color: "#09090a",
    icons: [
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
