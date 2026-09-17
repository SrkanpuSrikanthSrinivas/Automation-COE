/**
 * Every GitHub link on the site is built here.
 *
 * The repository is found automatically on Vercel (from the Git repo the project
 * is connected to). Override or configure it with these environment variables:
 *
 *   NEXT_PUBLIC_REPO_URL          https://github.com/owner/repo   (needed outside Vercel)
 *   NEXT_PUBLIC_REPO_BRANCH       default branch, default "main"
 *   NEXT_PUBLIC_REPO_DIR          folder the site lives in, if not the repo root
 *   NEXT_PUBLIC_DISCUSSIONS       "true" once GitHub Discussions is turned on
 *
 * When no repository can be found (for example local dev), repoUrl is null and
 * GitHub buttons are hidden rather than pointing at a page that doesn't exist.
 */

function resolveRepoUrl(): string | null {
  const explicit = process.env.NEXT_PUBLIC_REPO_URL?.trim();
  if (explicit) return explicit.replace(/\.git$/, "").replace(/\/+$/, "");

  const provider = process.env.VERCEL_GIT_PROVIDER;
  const owner = process.env.VERCEL_GIT_REPO_OWNER;
  const slug = process.env.VERCEL_GIT_REPO_SLUG;
  if (owner && slug && (!provider || provider === "github")) return `https://github.com/${owner}/${slug}`;
  return null;
}

export const repoUrl = resolveRepoUrl();
const branch = process.env.NEXT_PUBLIC_REPO_BRANCH?.trim() || "main";
const dir = (process.env.NEXT_PUBLIC_REPO_DIR?.trim() || "").replace(/^\/+|\/+$/g, "");
const discussionsOn = process.env.NEXT_PUBLIC_DISCUSSIONS === "true";

const inRepo = (path: string) => (dir ? `${dir}/${path}` : path);

/** Page showing a file, e.g. an example post. */
export function fileUrl(path: string) {
  return repoUrl && `${repoUrl}/blob/${branch}/${inRepo(path)}`;
}

/** GitHub's editor for an existing file. Non-members are offered a fork and PR automatically. */
export function editUrl(path: string) {
  return repoUrl && `${repoUrl}/edit/${branch}/${inRepo(path)}`;
}

/**
 * GitHub's "new file" editor, opened in the right folder with a starter
 * template already filled in. Non-members are offered a fork and PR automatically.
 */
export function newFileUrl(folder: string, filename: string, template: string) {
  if (!repoUrl) return null;
  const q = `filename=${encodeURIComponent(filename)}&value=${encodeURIComponent(template)}`;
  return `${repoUrl}/new/${branch}/${inRepo(folder)}?${q}`;
}

export function issueUrl(template?: string) {
  if (!repoUrl) return null;
  return template ? `${repoUrl}/issues/new?template=${template}` : `${repoUrl}/issues/new/choose`;
}

/** Where people ask questions: Discussions when enabled, otherwise a question issue. */
export const askUrl = repoUrl && (discussionsOn ? `${repoUrl}/discussions` : `${repoUrl}/issues/new?template=question.yml`);
export const askLabel = discussionsOn ? "Join the discussion" : "Ask a question";
