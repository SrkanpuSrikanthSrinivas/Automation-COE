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
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  repo: "https://github.com/your-org/test-automation-coe",
  // Where contributors discuss ideas before opening a pull request.
  discussions: "https://github.com/your-org/test-automation-coe/discussions",
  social: {
    github: "https://github.com/your-org",
    linkedin: "https://www.linkedin.com/company/your-org",
  },
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
  "Security",
  "Developer productivity",
] as const;

export type ToolCategory = (typeof toolCategories)[number];
