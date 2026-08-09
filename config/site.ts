function normalizeSiteUrl(url: string | undefined) {
  if (!url) return "http://localhost:3000";
  return /^https?:\/\//.test(url) ? url : `https://${url}`;
}

const url = normalizeSiteUrl(process.env.NEXT_PUBLIC_APP_URL);

export const siteConfig = {
  name: "Roshn REIT",
  description: "Real-estate opportunities, services, and market insights in Saudi Arabia.",
  url,
  ogImage: `${url}/logo.png`,
} as const;
