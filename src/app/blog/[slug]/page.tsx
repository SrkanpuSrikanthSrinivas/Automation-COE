import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { editUrl } from "@/lib/repo";
import { getContributor, getPost, getPosts, formatDate, type Contributor } from "@/lib/content";
import { Container } from "@/components/container";
import { Mdx } from "@/components/mdx";
import { Byline } from "@/components/people";
import { Tag } from "@/components/ui";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    openGraph: { type: "article", title: post.title, description: post.summary, publishedTime: post.date },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const authors = post.authors.map(getContributor).filter((c): c is Contributor => Boolean(c));
  const posts = getPosts();
  const i = posts.findIndex((p) => p.slug === slug);
  const newer = posts[i - 1];
  const edit = editUrl(`content/blog/${post.slug}.mdx`);
  const older = posts[i + 1];

  return (
    <Container className="py-14 sm:py-20">
      <article className="mx-auto max-w-[70ch]">
        <Link href="/blog" className="text-sm text-muted hover:text-ink">
          Blog
        </Link>
        <h1 className="h-page mt-3">{post.title}</h1>
        <p className="mt-4 text-lg text-muted">{post.summary}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-line py-4 text-sm text-muted">
          <Byline people={authors} />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>{post.readingMinutes} min read</span>
        </div>

        <div className="mt-10">
          <Mdx source={post.body} />
        </div>

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        )}

        {edit && (
          <p className="mt-8 text-sm text-muted">
            Spotted a mistake?{" "}
            <a href={edit} target="_blank" rel="noreferrer" className="font-medium text-signal hover:underline">
              Suggest an edit on GitHub
            </a>
            {" "}or{" "}
            <Link href="/contribute/ask-a-question" className="font-medium text-signal hover:underline">
              ask the author a question
            </Link>
            .
          </p>
        )}

        <nav aria-label="More posts" className="mt-12 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
          {older ? (
            <Link href={`/blog/${older.slug}`} className="group">
              <span className="text-sm text-muted">Older</span>
              <span className="mt-1 block font-semibold group-hover:text-signal">{older.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link href={`/blog/${newer.slug}`} className="group sm:text-right">
              <span className="text-sm text-muted">Newer</span>
              <span className="mt-1 block font-semibold group-hover:text-signal">{newer.title}</span>
            </Link>
          )}
        </nav>
      </article>
    </Container>
  );
}
