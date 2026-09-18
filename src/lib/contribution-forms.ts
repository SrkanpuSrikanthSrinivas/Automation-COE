import { toolCategories } from "@/config/site";

/** Field definitions drive both the rendered form and the server-side build. */
export type Field = {
  name: string;
  label: string;
  type: "text" | "textarea" | "markdown" | "select" | "checkboxes" | "list" | "url";
  help?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  options?: readonly string[];
  /** Fill this field's value by slugifying another field, until the user edits it. */
  slugOf?: string;
};

export type FormId = "write-a-post" | "add-a-tool" | "add-your-profile" | "propose-a-project";

export type FormDef = {
  id: FormId;
  title: string;
  intro: string;
  submitLabel: string;
  /** What the preview pane shows next to the form. */
  preview: "article" | "summary";
  fields: Field[];
};

export const openToOptions = ["mentoring", "pairing", "speaking", "reviewing", "co-authoring"] as const;

const slugField = (help: string): Field => ({
  name: "slug",
  label: "Web address",
  type: "text",
  slugOf: "title",
  required: true,
  help,
  placeholder: "stabilising-flaky-tests",
});

export const forms: Record<FormId, FormDef> = {
  "write-a-post": {
    id: "write-a-post",
    title: "Write a post",
    intro:
      "Share something you learned on a real project. Write it here, see the preview as you type, and submit when you are happy with it.",
    submitLabel: "Submit post",
    preview: "article",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, placeholder: "Stabilising flaky Playwright tests in CI" },
      { ...slugField("This becomes the address of your post."), placeholder: "stabilising-flaky-playwright-tests" },
      {
        name: "summary",
        label: "Summary",
        type: "textarea",
        required: true,
        maxLength: 200,
        help: "One or two sentences shown on the blog list.",
      },
      {
        name: "authors",
        label: "Author handles",
        type: "list",
        required: true,
        help: "Your profile file name, for example srikanth. Separate several authors with commas.",
      },
      { name: "tags", label: "Tags", type: "list", placeholder: "playwright, ci, flakiness" },
      {
        name: "body",
        label: "Your post",
        type: "markdown",
        required: true,
        help: "Markdown: ## for headings, ** ** for bold, - for lists, ``` for code blocks.",
      },
    ],
  },
  "add-a-tool": {
    id: "add-a-tool",
    title: "Add a tool",
    intro: "Showcase an open-source tool you maintain. It appears on the Tools page with its own product page.",
    submitLabel: "Submit tool",
    preview: "article",
    fields: [
      { name: "name", label: "Tool name", type: "text", required: true, placeholder: "Papio Selector" },
      { ...slugField("This becomes the address of the tool page."), slugOf: "name", placeholder: "papio-selector" },
      {
        name: "tagline",
        label: "Tagline",
        type: "textarea",
        required: true,
        maxLength: 120,
        help: "One sentence on what it does for a tester.",
      },
      { name: "category", label: "Category", type: "select", required: true, options: toolCategories },
      { name: "status", label: "Status", type: "select", required: true, options: ["stable", "beta", "experimental"] },
      { name: "platforms", label: "Works with", type: "list", required: true, placeholder: "Chrome, Playwright" },
      { name: "install", label: "Install command", type: "text", placeholder: "npm install my-tool" },
      { name: "repo", label: "Source code URL", type: "url", placeholder: "https://github.com/you/my-tool" },
      { name: "homepage", label: "Download or homepage URL", type: "url" },
      { name: "maintainers", label: "Maintainer handles", type: "list", required: true, help: "Profile file names, comma separated." },
      { name: "body", label: "Details", type: "markdown", required: true, help: "What it does, how to get started, how to contribute." },
    ],
  },
  "add-your-profile": {
    id: "add-your-profile",
    title: "Add your profile",
    intro: "Tell the community who you are and how they can work with you.",
    submitLabel: "Submit profile",
    preview: "summary",
    fields: [
      { name: "name", label: "Your name", type: "text", required: true },
      {
        name: "slug",
        label: "Handle",
        type: "text",
        slugOf: "name",
        required: true,
        help: "Use your GitHub handle. It becomes your profile address and links your posts and tools to you.",
      },
      { name: "role", label: "Role", type: "text", required: true, placeholder: "SDET, Payments team" },
      { name: "location", label: "Location", type: "text", placeholder: "Dallas, TX" },
      { name: "bio", label: "About you", type: "textarea", required: true, maxLength: 280 },
      { name: "skills", label: "Skills", type: "list", required: true, placeholder: "Playwright, API testing, CI/CD" },
      { name: "openTo", label: "Open to", type: "checkboxes", options: openToOptions, help: "How others can work with you." },
      { name: "github", label: "GitHub URL", type: "url" },
      { name: "linkedin", label: "LinkedIn URL", type: "url" },
      { name: "website", label: "Website", type: "url" },
    ],
  },
  "propose-a-project": {
    id: "propose-a-project",
    title: "Propose a project",
    intro: "Put a piece of work on the collaboration board so other people can pick it up with you.",
    submitLabel: "Submit project",
    preview: "summary",
    fields: [
      { name: "title", label: "Project title", type: "text", required: true, placeholder: "Add iOS examples to mobile-automation-mcp" },
      slugField("This becomes the anchor link on the board."),
      { name: "summary", label: "Summary", type: "textarea", required: true, maxLength: 240, help: "What gets built and who it helps." },
      { name: "skills", label: "Skills needed", type: "list", required: true, placeholder: "Appium, Python, iOS" },
      { name: "lead", label: "Lead handle", type: "text", required: true, help: "Who will guide contributors. Your profile file name." },
      { name: "effort", label: "Rough effort", type: "select", required: true, options: ["a few hours", "a few days", "ongoing"] },
      { name: "tool", label: "Related tool", type: "select", options: [], help: "Optional." },
      { name: "issue", label: "Tracking issue URL", type: "url", help: "Optional." },
    ],
  },
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
