/**
 * Picks the public URL of the site, in this order:
 *   1. NEXT_PUBLIC_SITE_URL, if set to a non-empty value
 *   2. Vercel's production domain (set automatically on Vercel)
 *   3. Vercel's per-deployment URL (preview builds)
 *   4. http://localhost:3000
 * Blank values are skipped, "https://" is added when missing, and a value
 * that still isn't a valid URL falls through instead of crashing the build.
 */
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];
  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      return new URL(withProtocol).origin;
    } catch {
      console.warn(`[site] Ignoring invalid site URL: "${value}"`);
    }
  }
  return "http://localhost:3000";
}

/**
 * Everything brand-specific lives here. Rename the CoE, swap links,
 * or add nav items without touching any page component.
 */
export const site = {
  name: "Test Automation CoE",
  shortName: "TA CoE",
  org: "AIQEAcademy",
  description:
    "A Center of Excellence for test automation: open-source tools, practical guides, and a community that builds them together.",
  url: resolveSiteUrl(),
  nav: [
    { href: "/tools", label: "Tools" },
    { href: "/blog", label: "Blog" },
    { href: "/community", label: "Community" },
    { href: "/collaborate", label: "Collaborate" },
    { href: "/contribute", label: "Contribute" },
  ],
} as const;

/** Tool categories, in the order they appear on the Tools page. */
export const toolCategories = [
  "Web automation",
  "Mobile automation",
  "AI for testing",
  "Developer productivity",
] as const;

export type ToolCategory = (typeof toolCategories)[number];
