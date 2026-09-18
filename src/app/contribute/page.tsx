import type { Metadata } from "next";
import Link from "next/link";
import { askLabel, askUrl, fileUrl, repoUrl } from "@/lib/repo";
import { getContributionTypes } from "@/lib/contribution-templates";
import { Container } from "@/components/container";
import { ButtonLink, PageHeader } from "@/components/ui";
import { CopyButton } from "@/components/copy-button";

export const metadata: Metadata = {
  title: "Contribute",
  description: "Write a post, add a tool, add your profile, or propose a project. Everything goes through a pull request.",
};

const steps = [
  { title: "Pick what to add", body: "A post, a tool, your profile, or a project. Each one has a form on this site." },
  { title: "Fill in the form", body: "Everything is explained as you go, and a live preview shows how it will look." },
  { title: "Submit", body: "No GitHub account needed. Your contribution is sent straight from the website." },
  { title: "A maintainer reviews it", body: "They check it over, usually within a few days, and can suggest changes." },
  { title: "It goes live", body: "Once accepted, the site updates itself in about a minute." },
];

export default function ContributePage() {
  const types = getContributionTypes();
  return (
    <Container>
      <PageHeader
        title="Contribute"
        intro="Write a post, showcase a tool, add your profile, or start a project, all from the forms on this site. You don’t need a GitHub account, though you can use one if you prefer."
      >
        {repoUrl && (
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={repoUrl}>Open the repository</ButtonLink>
            {askUrl && (
              <ButtonLink href={askUrl} variant="secondary">
                {askLabel}
              </ButtonLink>
            )}
          </div>
        )}
      </PageHeader>

      <section className="py-14">
        <h2 className="h-section">How a contribution goes live</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.title} className="border-t-2 border-line pt-4 first:border-signal">
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
          {types.map((t) => (
            <Link
              key={t.id}
              href={`#${t.id}`}
              className="rounded-full border border-line px-3.5 py-1.5 text-[15px] hover:border-signal hover:text-signal"
            >
              {t.title}
            </Link>
          ))}
        </nav>

        <div className="mt-10 space-y-16">
          {types.map((t) => {
            const example = fileUrl(t.example);
            return (
              <article key={t.id} id={t.id} className="grid scroll-mt-24 gap-6 lg:grid-cols-[1fr_1.4fr]">
                <div>
                  <h3 className="text-xl font-semibold">{t.title}</h3>
                  <p className="mt-2 text-muted">{t.body}</p>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <ButtonLink href={`/contribute/${t.id}`}>{t.formLabel}</ButtonLink>
                    {t.primary.href && (
                      <ButtonLink href={t.primary.href} variant="secondary">
                        Use GitHub instead
                      </ButtonLink>
                    )}
                  </div>
                  {example && (
                    <a
                      href={example}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-block text-[15px] font-medium text-signal hover:underline underline-offset-4"
                    >
                      See an example on GitHub
                    </a>
                  )}
                  <p className="mt-4 text-sm text-muted">
                    Saved as <code className="font-mono text-[13px]">{t.folder}/{t.filename}</code>
                  </p>
                </div>

                <figure className="overflow-hidden rounded-xl bg-code-bg text-code-ink">
                  <figcaption className="flex items-center justify-between gap-3 border-b border-white/10 py-2 pl-5 pr-2 font-mono text-[12.5px] text-code-ink/60">
                    <span className="truncate">What the form saves</span>
                    <CopyButton text={t.template} label="Copy template" />
                  </figcaption>
                  <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed">
                    <code>{t.template}</code>
                  </pre>
                </figure>
              </article>
            );
          })}
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
