import Link from "next/link";
import { site } from "@/config/site";
import { getCollabItems, getContributors, getPosts, getTools, formatDate, assertReferences } from "@/lib/content";
import { Container } from "@/components/container";
import { ButtonLink, SectionHeading, Tag, ToolStatus } from "@/components/ui";
import { SpecReport } from "@/components/home/spec-report";
import { Avatar } from "@/components/avatar";
import { StatusDot } from "@/components/icons";

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export default function HomePage() {
  assertReferences();
  const tools = getTools();
  const posts = getPosts();
  const people = getContributors();
  const openProjects = getCollabItems().filter((c) => c.status === "looking for help");
  const featured = tools.filter((t) => t.featured).slice(0, 5);

  const report = [
    { state: "pass" as const, text: `ships ${plural(tools.length, "open-source tool")}`, ms: 212 },
    { state: "pass" as const, text: `publishes ${plural(posts.length, "guide")} and articles`, ms: 96 },
    { state: "pass" as const, text: `connects ${plural(people.length, "practitioner")}`, ms: 58 },
    { state: "pass" as const, text: `lists ${plural(openProjects.length, "project")} that need help`, ms: 41 },
    { state: "pending" as const, text: "accepts your first pull request" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <Container className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <h1 className="h-display max-w-[14ch]">Test automation, built in the open.</h1>
            <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-muted">
              Tools, guides, and people from the {site.org} Center of Excellence. Use what we have built, learn how we
              test, and help build what comes next.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/tools">Browse tools</ButtonLink>
              <ButtonLink href="/contribute" variant="secondary">
                Start contributing
              </ButtonLink>
            </div>
          </div>
          <SpecReport lines={report} />
        </Container>
      </section>

      {/* Featured tools, listed like a test suite rather than a card grid */}
      <section>
        <Container className="py-16 sm:py-20">
          <SectionHeading title="Tools you can use today" action={{ href: "/tools", label: `See all ${tools.length} tools` }} />
          <ul className="divide-y divide-line border-y border-line">
            {featured.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/tools/${t.slug}`}
                  className="group grid gap-x-6 gap-y-1 py-5 sm:grid-cols-[14rem_1fr_auto] sm:items-baseline"
                >
                  <span className="text-lg font-semibold group-hover:text-signal">{t.name}</span>
                  <span className="text-muted">{t.tagline}</span>
                  <span className="flex items-center gap-4 text-sm text-muted">
                    <span>{t.category}</span>
                    <ToolStatus status={t.status} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* What the CoE is for */}
      <section className="border-y border-line bg-surface">
        <Container className="grid gap-10 py-16 md:grid-cols-3">
          {[
            {
              title: "Use",
              body: "Every tool here is open source, documented, and maintained by someone you can reach.",
              link: { href: "/tools", label: "Find a tool" },
            },
            {
              title: "Learn",
              body: "Practitioners write up what worked in real projects: frameworks, locators, CI, mobile, and AI.",
              link: { href: "/blog", label: "Read the blog" },
            },
            {
              title: "Build together",
              body: "Pick up an open project, pair with a maintainer, or propose an idea of your own.",
              link: { href: "/collaborate", label: "See open projects" },
            },
          ].map((p) => (
            <div key={p.title} className="border-l-2 border-signal pl-5">
              <h2 className="text-xl font-semibold">{p.title}</h2>
              <p className="mt-2 text-muted">{p.body}</p>
              <Link href={p.link.href} className="mt-3 inline-block font-medium text-signal hover:underline underline-offset-4">
                {p.link.label}
              </Link>
            </div>
          ))}
        </Container>
      </section>

      <Container className="grid gap-16 py-16 sm:py-20 lg:grid-cols-[1.4fr_1fr]">
        {/* Latest posts */}
        <section>
          <SectionHeading title="From the blog" action={{ href: "/blog", label: "All posts" }} />
          <ul className="space-y-7">
            {posts.slice(0, 3).map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="group block">
                  <time dateTime={p.date} className="text-sm text-muted">
                    {formatDate(p.date)}
                  </time>
                  <h3 className="mt-1 text-xl font-semibold leading-snug group-hover:text-signal">{p.title}</h3>
                  <p className="mt-1.5 text-muted">{p.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Help wanted */}
        <section>
          <SectionHeading title="Help wanted" action={{ href: "/collaborate", label: "Board" }} />
          <ul className="space-y-3">
            {openProjects.slice(0, 4).map((c) => (
              <li key={c.slug} className="rounded-lg border border-line bg-surface p-4">
                <p className="flex items-center gap-2 font-semibold">
                  <StatusDot tone="wait" />
                  {c.title}
                </p>
                <p className="mt-1 text-sm text-muted">{c.summary}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.skills.slice(0, 3).map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </Container>

      {/* Community */}
      <section>
        <Container>
          <div className="flex flex-col items-start gap-6 rounded-2xl bg-signal px-7 py-10 text-signal-ink sm:flex-row sm:items-center sm:px-10">
            <div className="flex -space-x-3">
              {people.slice(0, 6).map((p) => (
                <span key={p.slug} className="rounded-full ring-4 ring-signal">
                  <Avatar name={p.name} size={48} />
                </span>
              ))}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold tracking-tight">Find people who test the way you do</h2>
              <p className="mt-1 opacity-85">
                Add a profile with one JSON file and connect with mentors, reviewers, and co-authors.
              </p>
            </div>
            <Link
              href="/community"
              className="inline-flex h-11 items-center rounded-lg bg-signal-ink px-5 font-semibold text-signal hover:opacity-90"
            >
              Meet the community
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
