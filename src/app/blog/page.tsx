import type { Metadata } from "next";
import Link from "next/link";
import { getContributor, getPosts, formatDate, type Contributor } from "@/lib/content";
import { Container } from "@/components/container";
import { ButtonLink, EmptyState, PageHeader, Tag } from "@/components/ui";
import { getContribution } from "@/lib/contribution-templates";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guides and field notes on test automation from CoE practitioners.",
};

export default function BlogPage() {
  const posts = getPosts();
  const write = getContribution("write-a-post");
  const tags = [...new Set(posts.flatMap((p) => p.tags))].sort();

  return (
    <Container>
      <PageHeader title="Blog" intro="Guides and field notes from people doing test automation every day.">
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={write.primary.href ?? "/contribute#write-a-post"}>Write a post</ButtonLink>
          <ButtonLink href="/contribute#write-a-post" variant="quiet">
            How posting works
          </ButtonLink>
        </div>
      </PageHeader>

      {posts.length === 0 ? (
        <div className="py-12">
          <EmptyState title="No posts yet">
            Be the first to write one. <Link href="/contribute#write-a-post" className="text-signal">Here is how</Link>.
          </EmptyState>
        </div>
      ) : (
        <ol className="divide-y divide-line">
          {posts.map((p) => {
            const authors = p.authors.map(getContributor).filter((c): c is Contributor => Boolean(c));
            return (
              <li key={p.slug} id={p.slug}>
                <article className="grid gap-2 py-8 md:grid-cols-[10rem_1fr] md:gap-8">
                  <time dateTime={p.date} className="pt-1 text-sm text-muted">
                    {formatDate(p.date)}
                  </time>
                  <div className="max-w-[68ch]">
                    <h2 className="text-2xl font-semibold leading-snug tracking-tight">
                      <Link href={`/blog/${p.slug}`} className="hover:text-signal">
                        {p.title}
                      </Link>
                    </h2>
                    <p className="mt-2 text-muted">{p.summary}</p>
                    <p className="mt-3 text-sm text-muted">
                      {authors.map((a) => a.name).join(", ")}, {p.readingMinutes} min read
                      {p.draft && <span className="ml-2 font-semibold text-wait">Draft</span>}
                    </p>
                    {p.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {p.tags.map((t) => (
                          <Tag key={t}>{t}</Tag>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      )}
      {tags.length > 0 && <p className="sr-only">Topics covered: {tags.join(", ")}</p>}
    </Container>
  );
}
