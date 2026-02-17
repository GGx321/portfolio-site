// Public config (available in browser)
export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || "",
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Portfolio",
} as const;
