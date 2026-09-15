import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollabItems, getContributor, getContributors, getPosts, getTools, formatDate } from "@/lib/content";
import { Container } from "@/components/container";
import { Avatar } from "@/components/avatar";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { Tag, ToolStatus } from "@/components/ui";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getContributors().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const person = getContributor((await params).slug);
  return person ? { title: person.name, description: `${person.role}. ${person.bio}` } : {};
}

export default async function ProfilePage({ params }: Props) {
  const { slug } = await params;
  const person = getContributor(slug);
  if (!person) notFound();

  const posts = getPosts().filter((p) => p.authors.includes(slug));
  const tools = getTools().filter((t) => t.maintainers.includes(slug));
  const projects = getCollabItems().filter((c) => c.lead === slug && c.status !== "done");

  const links = [
    person.github && { href: person.github, label: "GitHub", icon: <GitHubIcon className="size-4" /> },
    person.linkedin && { href: person.linkedin, label: "LinkedIn", icon: <LinkedInIcon className="size-4" /> },
    person.website && { href: person.website, label: "Website", icon: null },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[];

  return (
    <Container className="py-14 sm:py-20">
      <Link href="/community" className="text-sm text-muted hover:text-ink">
        Community
      </Link>

      <header className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center">
        <Avatar name={person.name} size={96} />
        <div>
          <h1 className="h-page">{person.name}</h1>
          <p className="mt-1 text-lg text-muted">
            {person.role}
            {person.location && `, ${person.location}`}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm font-medium hover:border-muted"
              >
                {l.icon}
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_18rem]">
        <div className="max-w-[68ch] space-y-12">
          <p className="text-lg leading-relaxed">{person.bio}</p>

          {tools.length > 0 && (
            <section>
              <h2 className="h-section">Maintains</h2>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {tools.map((t) => (
                  <li key={t.slug}>
                    <Link href={`/tools/${t.slug}`} className="group flex items-baseline justify-between gap-4 py-3">
                      <span>
                        <span className="font-semibold group-hover:text-signal">{t.name}</span>
                        <span className="block text-sm text-muted">{t.tagline}</span>
                      </span>
                      <ToolStatus status={t.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {posts.length > 0 && (
            <section>
              <h2 className="h-section">Writing</h2>
              <ul className="mt-4 space-y-4">
                {posts.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}`} className="font-semibold hover:text-signal">
                      {p.title}
                    </Link>
                    <span className="block text-sm text-muted">{formatDate(p.date)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <h2 className="h-section">Looking for collaborators on</h2>
              <ul className="mt-4 space-y-3">
                {projects.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/collaborate#${c.slug}`} className="font-semibold hover:text-signal">
                      {c.title}
                    </Link>
                    <span className="block text-sm text-muted">{c.summary}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-8">
          <div>
            <h2 className="text-sm font-semibold">Skills</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {person.skills.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          </div>
          {person.openTo.length > 0 && (
            <div className="rounded-xl border border-line bg-surface p-5">
              <h2 className="text-sm font-semibold">Open to</h2>
              <ul className="mt-2 space-y-1 text-pass">
                {person.openTo.map((o) => (
                  <li key={o} className="capitalize">
                    {o}
                  </li>
                ))}
              </ul>
              {person.linkedin && (
                <a href={person.linkedin} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-semibold text-signal hover:underline">
                  Connect on LinkedIn
                </a>
              )}
            </div>
          )}
        </aside>
      </div>
    </Container>
  );
}
