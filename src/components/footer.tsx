import Link from "next/link";
import { site } from "@/config/site";
import { Container } from "./container";
import { Logo } from "./logo";
import { askLabel, askUrl, issueUrl, repoUrl } from "@/lib/repo";

type FooterLink = { href: string | null; label: string };

const groups: { title: string; links: FooterLink[] }[] = [
  {
    title: "Explore",
    links: [
      { href: "/tools", label: "Tools" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/community", label: "Members" },
      { href: "/collaborate", label: "Open projects" },
      { href: askUrl, label: askLabel },
    ],
  },
  {
    title: "Contribute",
    links: [
      { href: "/contribute", label: "How to contribute" },
      { href: issueUrl("site-bug.yml"), label: "Report a site problem" },
      { href: repoUrl, label: "Source code" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <Container className="grid gap-10 py-12 sm:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-3 text-sm text-muted">
            Run by the {site.org} community. Everything here is open source and built by contributors.
          </p>
        </div>
        {groups.map((g) => (
          <div key={g.title}>
            <h2 className="text-sm font-semibold">{g.title}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {g.links
                .filter((l): l is { href: string; label: string } => Boolean(l.href))
                .map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="text-muted hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container className="border-t border-line py-5 text-sm text-muted">
        © {new Date().getFullYear()} {site.org}. See the repository for license details.
      </Container>
    </footer>
  );
}
