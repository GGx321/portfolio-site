import { MetadataRoute } from "next";
import { siteConfig } from "@/config/env";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: "Web2, Web3, Telegram development",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#1a6b4a",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
