import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { getCollabItems, getContributor, getTool, getTools, type Contributor } from "@/lib/content";
import { Container } from "@/components/container";
import { ButtonLink, Tag, ToolStatus } from "@/components/ui";
import { CommandBlock } from "@/components/copy-button";
import { Mdx } from "@/components/mdx";
import { Byline } from "@/components/people";
import { StatusDot } from "@/components/icons";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getTools().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = getTool((await params).slug);
  return tool ? { title: tool.name, description: tool.tagline } : {};
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const maintainers = tool.maintainers.map(getContributor).filter((c): c is Contributor => Boolean(c));
  const projects = getCollabItems().filter((c) => c.tool === tool.slug && c.status !== "done");

  return (
    <>
      <section className="border-b border-line bg-surface">
        <Container className="py-12 sm:py-16">
          <Link href="/tools" className="text-sm text-muted hover:text-ink">
            Tools / {tool.category}
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <h1 className="h-display">{tool.name}</h1>
            <ToolStatus status={tool.status} />
          </div>
          <p className="mt-4 max-w-2xl text-xl leading-relaxed text-muted">{tool.tagline}</p>

          {(tool.repo || tool.homepage) && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {tool.repo && <ButtonLink href={tool.repo}>View source</ButtonLink>}
              {tool.homepage && (
                <ButtonLink href={tool.homepage} variant="secondary">
                  Get {tool.name}
                </ButtonLink>
              )}
            </div>
          )}
          {tool.install && (
            <div className="mt-6 max-w-xl">
              <CommandBlock command={tool.install} />
            </div>
          )}
        </Container>
      </section>

      <Container className="grid gap-12 py-12 lg:grid-cols-[1fr_17rem]">
        <article className="min-w-0 max-w-[70ch]">
          <Mdx source={tool.body} />
          <p className="mt-12 border-t border-line pt-5 text-sm text-muted">
            Something missing or out of date?{" "}
            <a href={`${site.repo}/edit/main/content/tools/${tool.slug}.mdx`} className="font-medium text-signal hover:underline">
              Edit this page on GitHub
            </a>
          </p>
        </article>

        <aside className="space-y-8 text-[15px] lg:sticky lg:top-24 lg:self-start">
          <div>
            <h2 className="text-sm font-semibold">Maintained by</h2>
            <div className="mt-2">
              <Byline people={maintainers} />
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold">Works with</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tool.platforms.map((p) => (
                <Tag key={p}>{p}</Tag>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold">Help build it</h2>
            {projects.length ? (
              <ul className="mt-2 space-y-2">
                {projects.map((p) => (
                  <li key={p.slug} className="flex items-baseline gap-2">
                    <StatusDot tone={p.status === "looking for help" ? "wait" : "pass"} />
                    <Link href={`/collaborate#${p.slug}`} className="hover:text-signal">
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-muted">
                No open projects yet.{" "}
                <Link href="/collaborate" className="text-signal hover:underline">
                  Propose one
                </Link>
                .
              </p>
            )}
          </div>
        </aside>
      </Container>
    </>
  );
}
