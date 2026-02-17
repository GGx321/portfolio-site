import { MetadataRoute } from "next";
import { siteConfig } from "@/config/env";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteConfig.url}/en`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          en: `${siteConfig.url}/en`,
          ru: `${siteConfig.url}/ru`,
        },
      },
    },
    {
      url: `${siteConfig.url}/ru`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          en: `${siteConfig.url}/en`,
          ru: `${siteConfig.url}/ru`,
        },
      },
    },
  ];
}
