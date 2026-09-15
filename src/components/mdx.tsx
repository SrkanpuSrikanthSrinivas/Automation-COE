import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";

/**
 * Components contributors can use inside .mdx files.
 * Add to this map to give writers new building blocks.
 */
function Callout({ tone = "note", children }: { tone?: "note" | "warning"; children: React.ReactNode }) {
  const border = tone === "warning" ? "border-wait" : "border-signal";
  return <div className={`not-prose my-6 rounded-r-lg border-l-4 ${border} bg-surface px-5 py-4 [&>p]:m-0`}>{children}</div>;
}

const components = {
  a: ({ href = "", ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
    href.startsWith("/") ? (
      <Link href={href} {...props} />
    ) : (
      <a href={href} target="_blank" rel="noreferrer" {...props} />
    ),
  Callout,
};

export function Mdx({ source }: { source: string }) {
  return (
    <div className="prose prose-coe max-w-none prose-headings:tracking-tight prose-h2:mt-12 prose-a:underline-offset-4">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
