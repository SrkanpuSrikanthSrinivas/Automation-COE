"use client";

import Link from "next/link";
import { useState } from "react";
import type { Tool } from "@/lib/content";
import { ToolStatus } from "@/components/ui";

type Summary = Pick<Tool, "slug" | "name" | "tagline" | "category" | "status" | "platforms">;

export function ToolFilter({ tools, categories }: { tools: Summary[]; categories: readonly string[] }) {
  const [active, setActive] = useState<string>("All");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const visible = tools.filter(
    (t) =>
      (active === "All" || t.category === active) &&
      (!q || `${t.name} ${t.tagline} ${t.platforms.join(" ")}`.toLowerCase().includes(q)),
  );
  const shownCategories = categories.filter((c) => visible.some((t) => t.category === c));
  const counts = Object.fromEntries(categories.map((c) => [c, tools.filter((t) => t.category === c).length]));

  return (
    <div className="grid gap-10 pt-10 md:grid-cols-[13rem_1fr]">
      <aside>
        <label htmlFor="tool-search" className="text-sm font-semibold">
          Search tools
        </label>
        <input
          id="tool-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name, platform…"
          className="mt-2 h-10 w-full rounded-lg border border-line bg-surface px-3 text-[15px] placeholder:text-muted/70"
        />
        <fieldset className="mt-6">
          <legend className="text-sm font-semibold">Category</legend>
          <div className="mt-2 flex flex-wrap gap-1 md:flex-col">
            {["All", ...categories].map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={active === c}
                onClick={() => setActive(c)}
                className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-left text-[15px] text-muted hover:text-ink aria-pressed:bg-surface aria-pressed:font-semibold aria-pressed:text-ink aria-pressed:shadow-[inset_0_0_0_1px_var(--line)]"
              >
                {c}
                <span className="ml-3 text-sm tabular-nums opacity-70">{c === "All" ? tools.length : counts[c]}</span>
              </button>
            ))}
          </div>
        </fieldset>
      </aside>

      <div aria-live="polite">
        {visible.length === 0 && (
          <p className="text-muted">
            No tools match “{query}”. Try a platform like <em>Chrome</em> or <em>Appium</em>, or clear the search.
          </p>
        )}
        {shownCategories.map((cat) => (
          <section key={cat} className="mb-12">
            <h2 className="mb-3 text-sm font-semibold text-muted">{cat}</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {visible
                .filter((t) => t.category === cat)
                .map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/tools/${t.slug}`}
                      className="group flex h-full flex-col rounded-xl border border-line bg-surface p-5 hover:border-signal"
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-lg font-semibold group-hover:text-signal">{t.name}</span>
                        <ToolStatus status={t.status} />
                      </span>
                      <span className="mt-1.5 text-muted">{t.tagline}</span>
                      <span className="mt-auto pt-4 text-sm text-muted">{t.platforms.join(", ")}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
