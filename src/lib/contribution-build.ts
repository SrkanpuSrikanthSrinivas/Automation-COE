import "server-only";
import { collabSchema, contributorSchema, postSchema, toolSchema } from "./content";
import { forms, slugify, type ContentFormId } from "./contribution-forms";

/** What the API writes to the repository, after validation. */
export type BuiltFile = { path: string; content: string; title: string; summary: string };

const today = () => new Date().toISOString().slice(0, 10);

const list = (value: unknown) =>
  String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const text = (value: unknown) => String(value ?? "").trim();

/** YAML for the small set of shapes frontmatter uses: strings, string arrays, booleans. */
function frontmatter(entries: [string, string | string[] | boolean | undefined][]) {
  const lines = entries
    .filter((entry): entry is [string, string | string[] | boolean] => {
      const v = entry[1];
      return v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0);
    })
    .map(([k, v]) => {
      if (Array.isArray(v)) return `${k}: [${v.map((item) => quote(item)).join(", ")}]`;
      if (typeof v === "boolean") return `${k}: ${v}`;
      return `${k}: ${quote(v)}`;
    });
  return `---\n${lines.join("\n")}\n---\n`;
}

const quote = (v: string) => `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

export class ValidationError extends Error {
  constructor(readonly issues: string[]) {
    super(issues.join("; "));
  }
}

function validate<T>(schema: { safeParse: (v: unknown) => { success: boolean; data?: T; error?: { issues: { path: PropertyKey[]; message: string }[] } } }, data: unknown, labels: Record<string, string>) {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(
      result.error!.issues.map((i) => {
        const key = String(i.path[0] ?? "");
        return `${labels[key] ?? key}: ${i.message}`;
      }),
    );
  }
}

export function buildFile(type: ContentFormId, values: Record<string, unknown>): BuiltFile {
  const labels = Object.fromEntries(forms[type].fields.map((f) => [f.name, f.label]));
  const slug = slugify(text(values.slug));
  if (!slug) throw new ValidationError(["Web address: give this a short name using letters and numbers"]);
  const body = text(values.body);

  switch (type) {
    case "write-a-post": {
      const meta = {
        title: text(values.title),
        summary: text(values.summary),
        date: today(),
        authors: list(values.authors).map(slugify),
        tags: list(values.tags).map((t) => t.toLowerCase()),
        draft: false,
      };
      validate(postSchema, meta, labels);
      if (body.length < 80) throw new ValidationError(["Your post: write at least a couple of paragraphs"]);
      return {
        path: `content/blog/${slug}.mdx`,
        content:
          frontmatter([
            ["title", meta.title],
            ["summary", meta.summary],
            ["date", meta.date],
            ["authors", meta.authors],
            ["tags", meta.tags],
          ]) + `\n${body}\n`,
        title: meta.title,
        summary: meta.summary,
      };
    }
    case "add-a-tool": {
      const meta = {
        name: text(values.name),
        tagline: text(values.tagline),
        category: text(values.category),
        status: text(values.status),
        platforms: list(values.platforms),
        install: text(values.install) || undefined,
        repo: text(values.repo) || undefined,
        homepage: text(values.homepage) || undefined,
        maintainers: list(values.maintainers).map(slugify),
        featured: false,
        order: 100,
      };
      validate(toolSchema, meta, labels);
      if (!body) throw new ValidationError(["Details: describe what the tool does"]);
      return {
        path: `content/tools/${slug}.mdx`,
        content:
          frontmatter([
            ["name", meta.name],
            ["tagline", meta.tagline],
            ["category", meta.category],
            ["status", meta.status],
            ["platforms", meta.platforms],
            ["install", meta.install],
            ["repo", meta.repo],
            ["homepage", meta.homepage],
            ["maintainers", meta.maintainers],
          ]) + `\n${body}\n`,
        title: meta.name,
        summary: meta.tagline,
      };
    }
    case "add-your-profile": {
      const meta = {
        name: text(values.name),
        role: text(values.role),
        location: text(values.location) || undefined,
        bio: text(values.bio),
        skills: list(values.skills),
        github: text(values.github) || undefined,
        linkedin: text(values.linkedin) || undefined,
        website: text(values.website) || undefined,
        openTo: Array.isArray(values.openTo) ? values.openTo.map(text) : list(values.openTo),
      };
      validate(contributorSchema, meta, labels);
      return {
        path: `content/contributors/${slug}.json`,
        content: `${JSON.stringify(meta, (_k, v) => (v === undefined ? undefined : v), 2)}\n`,
        title: meta.name,
        summary: meta.role,
      };
    }
    case "propose-a-project": {
      const meta = {
        title: text(values.title),
        summary: text(values.summary),
        status: "looking for help",
        skills: list(values.skills),
        lead: slugify(text(values.lead)),
        effort: text(values.effort),
        tool: text(values.tool) || undefined,
        issue: text(values.issue) || undefined,
        opened: today(),
      };
      validate(collabSchema, meta, labels);
      return {
        path: `content/collaborate/${slug}.md`,
        content: frontmatter([
          ["title", meta.title],
          ["summary", meta.summary],
          ["status", meta.status],
          ["skills", meta.skills],
          ["lead", meta.lead],
          ["effort", meta.effort],
          ["tool", meta.tool],
          ["issue", meta.issue],
          ["opened", meta.opened],
        ]),
        title: meta.title,
        summary: meta.summary,
      };
    }
  }
}
