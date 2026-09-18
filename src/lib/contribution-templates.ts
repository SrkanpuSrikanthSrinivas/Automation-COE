import { newFileUrl, fileUrl, issueUrl } from "./repo";

export type ContributionType = {
  id: "write-a-post" | "add-a-tool" | "add-your-profile" | "propose-a-project";
  title: string;
  /** Label for the button that opens the form on this site. */
  formLabel: string;
  body: string;
  folder: string;
  filename: string;
  example: string;
  template: string;
  /** Main action. Falls back to this page's anchor when no repository is configured. */
  primary: { label: string; href: string | null };
  secondary?: { label: string; href: string | null };
};

const today = () => new Date().toISOString().slice(0, 10);

const post = `---
title: "Your post title"
summary: "One or two sentences on what readers will learn."
date: ${today()}
authors: [your-github-handle]
tags: [playwright, ci]
---

Start with the problem you had, then show how you solved it.

## What we tried

## What worked

<Callout>Use a callout for a key takeaway or a warning.</Callout>
`;

const tool = `---
name: "My Tool"
tagline: "One sentence on what it does for a tester."
category: "Web automation"
status: beta
platforms: [Chrome, Playwright]
install: "npm install my-tool"
repo: "https://github.com/you/my-tool"
maintainers: [your-github-handle]
featured: false
---

## What it does

## Getting started

## How to contribute
`;

const profile = `{
  "name": "Your Name",
  "role": "SDET, Payments team",
  "location": "Dallas, TX",
  "bio": "What you work on and what you want to learn next. Under 280 characters.",
  "skills": ["Playwright", "API testing", "CI/CD"],
  "github": "https://github.com/your-github-handle",
  "linkedin": "https://www.linkedin.com/in/your-handle",
  "openTo": ["mentoring", "reviewing"]
}
`;

const project = `---
title: "Short, specific project title"
summary: "What gets built and who it helps."
status: looking for help
skills: [Playwright, TypeScript]
lead: your-github-handle
effort: a few days
opened: ${today()}
---
`;

export function getContributionTypes(): ContributionType[] {
  return [
    {
      id: "write-a-post",
      title: "Write a post",
      formLabel: "Write it here",
      body: "Share something you learned on a real project: a tutorial, a post-mortem, or a framework comparison. Rename the file to your post's slug. The author must match a profile file name.",
      folder: "content/blog",
      filename: "your-post-slug.mdx",
      example: "content/blog/welcome-to-the-coe.mdx",
      template: post,
      primary: { label: "Start a post on GitHub", href: newFileUrl("content/blog", "your-post-slug.mdx", post) },
    },
    {
      id: "add-a-tool",
      title: "Add a tool",
      formLabel: "Add a tool here",
      body: "Showcase an open-source tool you maintain. Category must be one of: Web automation, Mobile automation, AI for testing, Developer productivity. Status is stable, beta, or experimental.",
      folder: "content/tools",
      filename: "tool-slug.mdx",
      example: "content/tools/papio-selector.mdx",
      template: tool,
      primary: { label: "Add a tool on GitHub", href: newFileUrl("content/tools", "tool-slug.mdx", tool) },
    },
    {
      id: "add-your-profile",
      title: "Add your profile",
      formLabel: "Create your profile",
      body: "Rename the file to your GitHub handle; that becomes your profile address. “openTo” can include mentoring, pairing, speaking, reviewing, and co-authoring.",
      folder: "content/contributors",
      filename: "your-github-handle.json",
      example: "content/contributors/srikanth.json",
      template: profile,
      primary: {
        label: "Create your profile on GitHub",
        href: newFileUrl("content/contributors", "your-github-handle.json", profile),
      },
    },
    {
      id: "propose-a-project",
      title: "Propose a project",
      formLabel: "Propose it here",
      body: "Open a proposal first so people can discuss it. Once someone agrees to lead it, add it to the board. Effort is a few hours, a few days, or ongoing.",
      folder: "content/collaborate",
      filename: "project-slug.md",
      example: "content/collaborate/getting-started-guides.md",
      template: project,
      primary: { label: "Add it on GitHub", href: newFileUrl("content/collaborate", "project-slug.md", project) },
      secondary: { label: "Open a proposal issue", href: issueUrl("project-proposal.yml") },
    },
  ];
}

export function getContribution(id: ContributionType["id"]) {
  const c = getContributionTypes().find((t) => t.id === id)!;
  return { ...c, exampleUrl: fileUrl(c.example) };
}
