type Line = { state: "pass" | "pending"; text: string; ms?: number };

/**
 * The hero: the CoE described as a test run. Counts come from real content,
 * so the report stays true as the community grows.
 */
export function SpecReport({ lines }: { lines: Line[] }) {
  const passed = lines.filter((l) => l.state === "pass").length;
  const pending = lines.length - passed;
  return (
    <figure
      aria-label="Community status, shown as a test report"
      className="overflow-hidden rounded-xl bg-code-bg font-mono text-[13.5px] leading-relaxed text-code-ink shadow-[0_24px_60px_-30px_rgba(16,30,70,0.55)]"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 text-[12.5px] text-code-ink/60">
        <span>coe.spec.ts</span>
        <span className="hidden sm:inline">chromium, webkit, android, ios</span>
      </div>
      <ol className="space-y-1.5 px-5 py-5">
        {lines.map((l, i) => (
          <li
            key={l.text}
            className="spec-line flex items-baseline gap-3"
            style={{ animationDelay: `${150 + i * 170}ms` }}
          >
            {l.state === "pass" ? (
              <span className="text-[#4cc38a]" aria-label="passed">✓</span>
            ) : (
              <span className="text-[#e6b34d]" aria-label="pending">○</span>
            )}
            <span className={l.state === "pending" ? "text-[#e6b34d]" : ""}>{l.text}</span>
            {l.ms !== undefined && <span className="ml-auto pl-3 text-code-ink/40">{l.ms}ms</span>}
          </li>
        ))}
      </ol>
      <figcaption
        className="spec-line border-t border-white/10 px-5 py-3"
        style={{ animationDelay: `${150 + lines.length * 170 + 120}ms` }}
      >
        <span className="text-[#4cc38a]">{passed} passed</span>
        {pending > 0 && <span className="text-[#e6b34d]">, {pending} waiting on you</span>}
      </figcaption>
    </figure>
  );
}
