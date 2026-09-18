# Contributing

Thanks for helping build the CoE.

**The easiest way is on the website.** Go to `/contribute`, pick what you want to add, fill in the form, and submit. You don't need a GitHub account, and you see a preview as you type.

The rest of this page is for people who would rather work in Git. Most contributions are a single file.

| Have a question first? Ask at `/contribute/ask-a-question`; it reaches maintainers as an issue here.

| I want to… | Create or edit |
| --- | --- |
| Write a blog post | `content/blog/<slug>.mdx` |
| Showcase a tool | `content/tools/<slug>.mdx` |
| Add my profile | `content/contributors/<github-handle>.json` (copy `_template.json`) |
| Propose a project | Open a "Project proposal" issue first, then add `content/collaborate/<slug>.md` |

Full templates with every field are on the site at `/contribute`.

## Workflow

1. Fork the repo and create a branch.
2. Add your file. Use lowercase, hyphenated slugs (`flaky-test-triage.mdx`).
3. Run `npm run dev` to preview, or skip this and rely on the Vercel preview on your PR.
4. Open a pull request and fill in the checklist.
5. If the preview build fails, open the build log: it names the file and field to fix.

## Writing guidelines

- Write for a tester who hasn't seen your project. Lead with the problem.
- Include runnable code where you can, and say which versions you used.
- No confidential code, URLs, credentials, or customer data.
- Available MDX components: `<Callout>` and `<Callout tone="warning">`.

## Code changes to the site

- Keep pages reading from `src/lib/content.ts`; don't read files directly in components.
- Run `npm run validate` before pushing.
