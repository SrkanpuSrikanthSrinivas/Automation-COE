import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getContributors, getPosts, getTools } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/tools", "/blog", "/community", "/collaborate", "/contribute"].map((p) => ({
    url: `${site.url}${p}`,
  }));
  return [
    ...pages,
    ...getTools().map((t) => ({ url: `${site.url}/tools/${t.slug}` })),
    ...getPosts({ includeDrafts: false }).map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: p.date })),
    ...getContributors().map((c) => ({ url: `${site.url}/community/${c.slug}` })),
  ];
}
