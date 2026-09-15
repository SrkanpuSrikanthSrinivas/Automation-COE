import Link from "next/link";
import { site } from "@/config/site";
import { Container } from "./container";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { NavLinks, MobileNav } from "./nav";
import { GitHubIcon } from "./icons";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur supports-[backdrop-filter]:bg-paper/70">
      <Container className="flex h-15 items-center gap-6">
        <Link href="/" className="shrink-0 rounded" aria-label={`${site.name} home`}>
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <NavLinks />
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <a
            href={site.repo}
            className="grid size-9 place-items-center rounded-md text-muted hover:bg-line/60 hover:text-ink"
            aria-label="Source on GitHub"
            title="Source on GitHub"
          >
            <GitHubIcon className="size-[18px]" />
          </a>
          <ThemeToggle />
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
