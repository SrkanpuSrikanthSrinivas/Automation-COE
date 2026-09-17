# Test Automation CoE website

The public home of the Test Automation Center of Excellence: a showcase for our open-source tools, a blog, a community directory, and a collaboration board. Everything on the site is generated from files in `content/`, and anyone can contribute with a pull request.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4, and MDX. Every page is statically generated, so it is fast and costs almost nothing to host on Vercel.

## Run it locally

Requires Node.js 20.9 or newer (works on Intel and Apple Silicon Macs).

```bash
npm install
npm run dev        # http://localhost:3000
npm run validate   # typecheck + production build, the same check CI runs
```

## Deploy to Vercel

1. Push this folder to a **public** GitHub repository, with `package.json` at the repository root.
2. In Vercel, choose **Add New → Project** and import the repository. The Next.js preset is detected automatically.
3. Deploy. Every pull request gets its own preview URL, and merges to `main` go live automatically.

All GitHub links on the site (Contribute buttons, "Edit on GitHub", "Ask a question") are built from the repository Vercel is connected to, so nothing needs editing. If the site stops showing GitHub buttons, Vercel couldn't identify the repository; set `NEXT_PUBLIC_REPO_URL`.

### Environment variables (all optional)

| Variable | Example | When to set it |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://automation-coe.vercel.app` | Once you have a custom domain. Otherwise Vercel's production domain is used. |
| `NEXT_PUBLIC_REPO_URL` | `https://github.com/owner/repo` | Deploying from the Vercel CLI or anywhere other than a Git-connected Vercel project. |
| `NEXT_PUBLIC_REPO_BRANCH` | `main` | Your default branch isn't `main`. |
| `NEXT_PUBLIC_REPO_DIR` | `website` | The site lives in a subfolder of the repository. |
| `NEXT_PUBLIC_DISCUSSIONS` | `true` | After turning on GitHub Discussions (repo **Settings → General → Features**). Until then, "Ask a question" opens a Question issue. |

Redeploy after changing any of these; they are read at build time.

## Where things live

```
content/
  blog/            one .mdx file per post
  tools/           one .mdx file per showcased tool
  contributors/    one .json file per person (file name = profile URL)
  collaborate/     one .md file per open project
src/
  config/site.ts   name, nav, links, tool categories — rename the CoE here
  lib/content.ts   loads and validates all content (zod schemas)
  app/             routes: /, /tools, /blog, /community, /collaborate, /contribute
  components/      UI building blocks; components/mdx.tsx lists what writers can use in MDX
```

### Content is validated at build time

Every file in `content/` is checked against a schema, and cross-references are checked too (a post's author must have a profile, a project's tool must exist). A bad contribution fails the PR preview with the exact file and field, so it can never break the live site.

## Scaling roadmap

The site is deliberately files-first: no database, no auth, nothing to operate. The data layer is isolated in `src/lib/content.ts`, so each step below replaces a function rather than rewriting pages.

| When you need… | Add | Notes |
| --- | --- | --- |
| Search | Pagefind or Orama (static index) | No server needed; runs at build time. |
| Comments on posts | Giscus (GitHub Discussions) | Keeps conversations next to the code. |
| Sign-in and self-serve profiles | Auth.js with GitHub/LinkedIn/Microsoft Entra | Microsoft Entra fits an internal CoE with SSO. |
| Likes, follows, "connect" requests, event RSVPs | Postgres (Neon via Vercel Marketplace) + Drizzle ORM | Move `getContributors()` to the database first. |
| Editing content without Git | A Git-backed CMS (Keystatic, TinaCMS) | Writers get a UI; content still lands as PRs. |
| Tool usage stats | GitHub and npm APIs with Next.js `revalidate` | Refresh hourly with incremental static regeneration. |
| Docs per tool (Playwright-style) | A `/docs/[tool]/[...slug]` route reading `content/docs/` | Same MDX pipeline, adds a sidebar. |
| Many languages | Next.js i18n routing with `content/<locale>/` | Schema stays the same per locale. |

## License

Choose licenses for code and content before launch and add a `LICENSE` file.
