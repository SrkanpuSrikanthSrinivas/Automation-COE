import Link from "next/link";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "quiet";
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", className = "" }: ButtonProps) {
  const styles = {
    primary: "bg-signal text-signal-ink hover:brightness-110",
    secondary: "border border-line bg-surface text-ink hover:border-muted",
    quiet: "text-signal hover:underline underline-offset-4 px-0",
  }[variant];
  const external = /^https?:/.test(href);
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`inline-flex h-11 items-center gap-2 rounded-lg px-5 text-[15px] font-semibold ${styles} ${className}`}
    >
      {children}
    </Link>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line px-2.5 py-0.5 text-[13px] text-muted">
      {children}
    </span>
  );
}

export function PageHeader({ title, intro, children }: { title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <div className="border-b border-line pb-10 pt-14 sm:pt-20">
      <h1 className="h-page max-w-3xl">{title}</h1>
      {intro && <p className="mt-4 max-w-2xl text-lg text-muted">{intro}</p>}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}

export function SectionHeading({ title, action }: { title: string; action?: { href: string; label: string } }) {
  return (
    <div className="mb-6 flex items-baseline justify-between gap-4">
      <h2 className="h-section">{title}</h2>
      {action && (
        <Link href={action.href} className="shrink-0 text-[15px] font-medium text-signal hover:underline underline-offset-4">
          {action.label}
        </Link>
      )}
    </div>
  );
}

const statusTone = {
  stable: "text-pass",
  beta: "text-wait",
  experimental: "text-muted",
} as const;

export function ToolStatus({ status }: { status: keyof typeof statusTone }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[13px] font-medium ${statusTone[status]}`}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {status[0].toUpperCase() + status.slice(1)}
    </span>
  );
}

export function EmptyState({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-line px-6 py-10 text-center">
      <p className="font-semibold">{title}</p>
      <div className="mx-auto mt-2 max-w-md text-muted">{children}</div>
    </div>
  );
}
