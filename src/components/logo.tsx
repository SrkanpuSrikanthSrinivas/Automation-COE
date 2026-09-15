import { site } from "@/config/site";

/** Mark: a check inside a locator bracket. Swap for your own SVG any time. */
export function Logo() {
  return (
    <span className="flex items-center gap-2.5 font-semibold tracking-tight">
      <svg viewBox="0 0 28 28" className="size-7" aria-hidden="true">
        <rect width="28" height="28" rx="6" fill="var(--signal)" />
        <path d="M8 7H6v14h2M20 7h2v14h-2" stroke="var(--signal-ink)" strokeWidth="2" fill="none" />
        <path d="m10 14.5 2.8 2.8L18.5 11" stroke="var(--signal-ink)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{site.name}</span>
    </span>
  );
}
