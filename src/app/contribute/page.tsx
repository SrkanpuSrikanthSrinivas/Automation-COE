import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";
import { Container } from "@/components/container";
import { ButtonLink, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contribute",
  description: "Write a post, add a tool, add your profile, or propose a project. Everything goes through a pull request.",
};

const steps = [
  { title: "Fork the repository", body: "Or use the “Edit on GitHub” link on any page to have GitHub fork it for you." },
  { title: "Add or edit a file in /content", body: "Posts, tools, profiles, and projects are plain Markdown or JSON. Templates are below." },
  { title: "Open a pull request", body: "The PR template has a short checklist. Link any related issue." },
  {
    title: "Check your preview",
    body: "Vercel builds a preview of the whole site for every PR. If a field is missing or a name is misspelled, the build fails and tells you which line.",
  },
  { title: "Get a review and merge", body: "A maintainer reviews within a few days. Once merged, the live site updates in about a minute." },
];

const templates = [
  {
    id: "write-a-post",
    title: "Write a post",
    file: "content/blog/your-post-slug.mdx",
    body: "Share something you learned on a real project. Tutorials, post-mortems, and framework comparisons all work. Your author name must match a profile file.",
    code: `---
title: "Stabilising flaky Playwright tests in CI"
summary: "Three changes that took our retry rate from 9% to under 1%."
date: 2026-09-15
authors: [your-github-handle]
tags: [playwright, ci, flakiness]
---

Start with the problem you had.

<Callout>Use callouts for warnings or key takeaways.</Callout>`,
  },
  {
    id: "add-a-tool",
    title: "Add a tool",
    file: "content/tools/tool-slug.mdx",
    body: "Showcase an open-source tool you maintain. Category must be one of the categories on the Tools page.",
    code: `---
name: "My Tool"
tagline: "One sentence on what it does for a tester."
category: "Web automation"
status: beta            # stable | beta | experimental
platforms: [Chrome, Playwright]
install: "npm install my-tool"
repo: "https://github.com/you/my-tool"
maintainers: [your-github-handle]
featured: false
---

## What it does
## Getting started
## How to contribute`,
  },
  {
    id: "add-your-profile",
    title: "Add your profile",
    file: "content/contributors/your-github-handle.json",
    body: "Your file name becomes your profile URL. Use “openTo” to tell people how they can work with you.",
    code: `{
  "name": "Your Name",
  "role": "SDET, Payments team",
  "location": "Dallas, TX",
  "bio": "What you work on and what you want to learn next.",
  "skills": ["Playwright", "API testing", "CI/CD"],
  "github": "https://github.com/your-handle",
  "linkedin": "https://www.linkedin.com/in/your-handle",
  "openTo": ["mentoring", "reviewing"]
}`,
  },
  {
    id: "propose-a-project",
    title: "Propose a project",
    file: "content/collaborate/project-slug.md",
    body: "Start with an issue so people can discuss it. Once someone agrees to lead it, add it to the board.",
    code: `---
title: "Add iOS examples to mobile-automation-mcp"
summary: "Sample flows for XCUITest so new users can start in minutes."
status: looking for help   # looking for help | in progress | done
skills: [Appium, iOS, Python]
lead: your-github-handle
effort: a few days          # a few hours | a few days | ongoing
tool: mobile-automation-mcp # optional, a tool slug
issue: "https://github.com/your-org/repo/issues/12"
opened: 2026-09-15
---`,
  },
];

export default function ContributePage() {
  return (
    <Container>
      <PageHeader
        title="Contribute"
        intro="Everything on this site is a file in a public repository. If you can open a pull request, you can publish a post, showcase a tool, or start a project."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={site.repo}>Open the repository</ButtonLink>
          <ButtonLink href={site.discussions} variant="secondary">
            Ask a question first
          </ButtonLink>
        </div>
      </PageHeader>

      <section className="py-14">
        <h2 className="h-section">How a contribution goes live</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.title} className="relative border-t-2 border-line pt-4 first:border-signal">
              <span className="text-sm font-semibold text-signal">Step {i + 1}</span>
              <h3 className="mt-1 font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-[15px] text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-line py-14">
        <h2 className="h-section">Pick what you want to add</h2>
        <nav aria-label="Contribution types" className="mt-4 flex flex-wrap gap-2">
          {templates.map((t) => (
            <Link key={t.id} href={`#${t.id}`} className="rounded-full border border-line px-3.5 py-1.5 text-[15px] hover:border-signal hover:text-signal">
              {t.title}
            </Link>
          ))}
        </nav>

        <div className="mt-10 space-y-14">
          {templates.map((t) => (
            <article key={t.id} id={t.id} className="grid scroll-mt-24 gap-6 lg:grid-cols-[1fr_1.4fr]">
              <div>
                <h3 className="text-xl font-semibold">{t.title}</h3>
                <p className="mt-2 text-muted">{t.body}</p>
                <p className="mt-4 text-sm">
                  Create <code className="rounded bg-signal/10 px-1.5 py-0.5 font-mono text-[13px]">{t.file}</code>
                </p>
              </div>
              <pre className="overflow-x-auto rounded-xl bg-code-bg p-5 font-mono text-[13px] leading-relaxed text-code-ink">
                <code>{t.code}</code>
              </pre>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-8">
        <h2 className="text-xl font-semibold">Contributing code to a tool?</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Each tool lives in its own repository with its own contributing guide. Open the tool’s page, follow “View
          source”, and look for issues labelled <em>good first issue</em>.
        </p>
        <ButtonLink href="/tools" variant="quiet" className="mt-2">
          Browse tools
        </ButtonLink>
      </section>
    </Container>
  );
}
