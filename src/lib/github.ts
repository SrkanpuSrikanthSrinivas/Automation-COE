import "server-only";

/**
 * Turns a submitted form into a file in the repository, so contributors never
 * have to touch GitHub themselves.
 *
 * Configure in Vercel (Settings → Environment Variables):
 *   GITHUB_TOKEN        fine-grained token with Contents: read & write and
 *                       Pull requests: read & write on this repository
 *   GITHUB_REPO         owner/repo (optional on Vercel; detected from the Git connection)
 *   CONTRIBUTE_MODE     "pr" (default) opens a pull request for review,
 *                       "direct" commits to the default branch and publishes immediately
 *   CONTRIBUTE_PASSCODE shared word contributors must enter; required for "direct" mode
 *   CONTRIBUTE_DRY_RUN  "true" skips GitHub entirely, for local testing
 */

const API = "https://api.github.com";

function repoSlug(): string | null {
  const explicit = process.env.GITHUB_REPO?.trim();
  if (explicit) return explicit.replace(/^https?:\/\/github\.com\//, "").replace(/\.git$/, "").replace(/\/+$/, "");
  const owner = process.env.VERCEL_GIT_REPO_OWNER;
  const slug = process.env.VERCEL_GIT_REPO_SLUG;
  return owner && slug ? `${owner}/${slug}` : null;
}

export const dryRun = process.env.CONTRIBUTE_DRY_RUN === "true";
export const mode: "pr" | "direct" = process.env.CONTRIBUTE_MODE === "direct" ? "direct" : "pr";
const passcode = process.env.CONTRIBUTE_PASSCODE?.trim();
export const passcodeRequired = Boolean(passcode) || mode === "direct";

/** Direct publishing without a passcode would let anyone write to the repository. */
const misconfigured = mode === "direct" && !passcode;

export function submissionsEnabled() {
  if (misconfigured) return false;
  if (dryRun) return true;
  return Boolean(process.env.GITHUB_TOKEN?.trim() && repoSlug());
}

export function checkPasscode(supplied: string | undefined) {
  if (!passcode) return true;
  return typeof supplied === "string" && supplied.trim() === passcode;
}

export function configProblem(): string | null {
  if (misconfigured) return "CONTRIBUTE_MODE is \"direct\" but CONTRIBUTE_PASSCODE is not set.";
  if (dryRun) return null;
  if (!process.env.GITHUB_TOKEN?.trim()) return "GITHUB_TOKEN is not set.";
  if (!repoSlug()) return "GITHUB_REPO is not set and the repository could not be detected.";
  return null;
}

async function gh<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new GitHubError(res.status, detail.slice(0, 300));
  }
  return res.json() as Promise<T>;
}

export class GitHubError extends Error {
  constructor(
    readonly status: number,
    detail: string,
  ) {
    super(`GitHub responded ${status}: ${detail}`);
  }
}

export type SubmitResult = { url: string; mode: "pr" | "direct"; branch?: string };

/**
 * Questions become issues labelled "question" so maintainers see them in one
 * place and anyone can answer. The asker never leaves the site.
 * The token needs "Issues: read and write" for this.
 */
export async function submitQuestion(opts: { subject: string; body: string; author: string; link?: string }) {
  const slug = repoSlug();
  const body = [
    opts.body,
    opts.link ? `\nRelated page: ${opts.link}` : "",
    `\n— asked from the website by ${opts.author || "an anonymous visitor"}`,
  ]
    .filter(Boolean)
    .join("\n");

  if (dryRun || !slug) {
    console.log(`\n--- dry run: question "${opts.subject}" ---\n${body}\n---\n`);
    return { url: "https://example.com/dry-run/question" };
  }

  const issue = await gh<{ html_url: string }>(`/repos/${slug}/issues`, {
    method: "POST",
    body: JSON.stringify({ title: opts.subject, body, labels: ["question"] }),
  });
  return { url: issue.html_url };
}

export async function submitContribution(opts: {
  /** Repository-relative path, built on the server from the contribution type and slug. */
  path: string;
  content: string;
  title: string;
  /** Shown in the pull request body so reviewers know where it came from. */
  summary: string;
  author: string;
}): Promise<SubmitResult> {
  const slug = repoSlug();
  if (dryRun || !slug) {
    // Local testing: print the file instead of writing to GitHub.
    console.log(`\n--- dry run: ${opts.path} ---\n${opts.content}---\n`);
    return { url: `https://example.com/dry-run/${opts.path}`, mode, branch: "dry-run" };
  }

  const repo = await gh<{ default_branch: string }>(`/repos/${slug}`);
  const base = process.env.NEXT_PUBLIC_REPO_BRANCH?.trim() || repo.default_branch;
  const dir = (process.env.NEXT_PUBLIC_REPO_DIR?.trim() || "").replace(/^\/+|\/+$/g, "");
  const path = dir ? `${dir}/${opts.path}` : opts.path;
  const message = `${opts.title} (via the website)`;
  const content = Buffer.from(opts.content, "utf8").toString("base64");

  if (mode === "direct") {
    const commit = await gh<{ commit: { html_url: string } }>(`/repos/${slug}/contents/${encodeContentPath(path)}`, {
      method: "PUT",
      body: JSON.stringify({ message, content, branch: base }),
    });
    return { url: commit.commit.html_url, mode };
  }

  const head = `contrib/${stamp()}-${opts.path.split("/").pop()?.replace(/\.[^.]+$/, "")}`;
  const ref = await gh<{ object: { sha: string } }>(`/repos/${slug}/git/ref/heads/${base}`);
  await gh(`/repos/${slug}/git/refs`, {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${head}`, sha: ref.object.sha }),
  });
  await gh(`/repos/${slug}/contents/${encodeContentPath(path)}`, {
    method: "PUT",
    body: JSON.stringify({ message, content, branch: head }),
  });
  const pr = await gh<{ html_url: string }>(`/repos/${slug}/pulls`, {
    method: "POST",
    body: JSON.stringify({
      title: opts.title,
      head,
      base,
      body: `${opts.summary}\n\nSubmitted from the website by **${opts.author}**.\n\nThe preview build below shows how it will look once merged.`,
    }),
  });
  return { url: pr.html_url, mode, branch: head };
}

const encodeContentPath = (p: string) => p.split("/").map(encodeURIComponent).join("/");

const stamp = () => new Date().toISOString().replace(/[-:T]/g, "").slice(0, 12);
