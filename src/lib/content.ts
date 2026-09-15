import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";
import { toolCategories } from "@/config/site";

/**
 * All community content is plain files under /content, contributed by pull request.
 * Every file is validated here at build time, so a malformed contribution fails the
 * Vercel preview build with a clear message instead of breaking the live site.
 *
 * When the site outgrows files (user accounts, comments, likes), swap these
 * functions for database queries — pages only depend on the return types.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");

const slugFrom = (file: string) => file.replace(/\.(mdx?|json)$/, "");

function readDir(dir: string, exts: string[]) {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => exts.some((e) => f.endsWith(e)) && !f.startsWith("_"))
    .map((f) => ({ file: f, slug: slugFrom(f), raw: fs.readFileSync(path.join(full, f), "utf8") }));
}

function parse<T>(schema: z.ZodType<T>, data: unknown, where: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`).join("\n");
    throw new Error(`Invalid content in ${where}:\n${issues}`);
  }
  return result.data;
}

const isoDate = z
  .union([z.string(), z.date()])
  .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v))
  .pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "use YYYY-MM-DD"));

/* ---------- Contributors ---------- */

export const contributorSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  location: z.string().optional(),
  bio: z.string().max(280, "keep the bio under 280 characters"),
  skills: z.array(z.string()).min(1).max(8),
  github: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  website: z.string().url().optional(),
  openTo: z.array(z.enum(["mentoring", "pairing", "speaking", "reviewing", "co-authoring"])).default([]),
});
export type Contributor = z.infer<typeof contributorSchema> & { slug: string };

export function getContributors(): Contributor[] {
  return readDir("contributors", [".json"])
    .map(({ file, slug, raw }) => ({ slug, ...parse(contributorSchema, JSON.parse(raw), `contributors/${file}`) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getContributor(slug: string) {
  return getContributors().find((c) => c.slug === slug);
}

/* ---------- Tools (the products we showcase) ---------- */

export const toolSchema = z.object({
  name: z.string(),
  tagline: z.string().max(120),
  category: z.enum(toolCategories),
  status: z.enum(["stable", "beta", "experimental"]),
  platforms: z.array(z.string()).min(1),
  install: z.string().optional(),
  repo: z.string().url().optional(),
  homepage: z.string().url().optional(),
  maintainers: z.array(z.string()).min(1),
  featured: z.boolean().default(false),
  order: z.number().default(100),
});
export type Tool = z.infer<typeof toolSchema> & { slug: string; body: string };

export function getTools(): Tool[] {
  return readDir("tools", [".mdx", ".md"])
    .map(({ file, slug, raw }) => {
      const { data, content } = matter(raw);
      return { slug, body: content, ...parse(toolSchema, data, `tools/${file}`) };
    })
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export function getTool(slug: string) {
  return getTools().find((t) => t.slug === slug);
}

/* ---------- Blog ---------- */

export const postSchema = z.object({
  title: z.string().min(5),
  summary: z.string().max(200),
  date: isoDate,
  authors: z.array(z.string()).min(1),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});
export type Post = z.infer<typeof postSchema> & { slug: string; body: string; readingMinutes: number };

export function getPosts({ includeDrafts = process.env.NODE_ENV !== "production" } = {}): Post[] {
  return readDir("blog", [".mdx", ".md"])
    .map(({ file, slug, raw }) => {
      const { data, content } = matter(raw);
      const meta = parse(postSchema, data, `blog/${file}`);
      return { slug, body: content, readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)), ...meta };
    })
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string) {
  return getPosts().find((p) => p.slug === slug);
}

/* ---------- Collaboration board ---------- */

export const collabSchema = z.object({
  title: z.string(),
  summary: z.string().max(240),
  status: z.enum(["looking for help", "in progress", "done"]),
  skills: z.array(z.string()).min(1),
  lead: z.string(),
  effort: z.enum(["a few hours", "a few days", "ongoing"]),
  tool: z.string().optional(),
  issue: z.string().url().optional(),
  opened: isoDate,
});
export type CollabItem = z.infer<typeof collabSchema> & { slug: string };

export function getCollabItems(): CollabItem[] {
  const statusOrder = { "looking for help": 0, "in progress": 1, done: 2 } as const;
  return readDir("collaborate", [".md", ".mdx"])
    .map(({ file, slug, raw }) => ({ slug, ...parse(collabSchema, matter(raw).data, `collaborate/${file}`) }))
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status] || b.opened.localeCompare(a.opened));
}

/* ---------- Cross-reference checks ---------- */

/**
 * Fails the build if a post, tool, or project names a contributor or tool that
 * has no file. Keeps profile links from 404-ing as the community grows.
 */
export function assertReferences() {
  const people = new Set(getContributors().map((c) => c.slug));
  const tools = new Set(getTools().map((t) => t.slug));
  const problems: string[] = [];
  for (const p of getPosts({ includeDrafts: true }))
    p.authors.filter((a) => !people.has(a)).forEach((a) => problems.push(`blog/${p.slug}: unknown author "${a}"`));
  for (const t of getTools())
    t.maintainers.filter((m) => !people.has(m)).forEach((m) => problems.push(`tools/${t.slug}: unknown maintainer "${m}"`));
  for (const c of getCollabItems()) {
    if (!people.has(c.lead)) problems.push(`collaborate/${c.slug}: unknown lead "${c.lead}"`);
    if (c.tool && !tools.has(c.tool)) problems.push(`collaborate/${c.slug}: unknown tool "${c.tool}"`);
  }
  if (problems.length) throw new Error(`Broken content references:\n  - ${problems.join("\n  - ")}`);
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
