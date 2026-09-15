import Link from "next/link";
import type { Contributor } from "@/lib/content";
import { Avatar } from "./avatar";

/** "By Srikanth and Priya" with links to profiles. */
export function Byline({ people }: { people: Contributor[] }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex -space-x-2">
        {people.map((p) => (
          <span key={p.slug} className="rounded-full ring-2 ring-paper">
            <Avatar name={p.name} size={26} />
          </span>
        ))}
      </span>
      <span>
        {people.map((p, i) => (
          <span key={p.slug}>
            {i > 0 && (i === people.length - 1 ? " and " : ", ")}
            <Link href={`/community/${p.slug}`} className="font-medium text-ink hover:underline underline-offset-4">
              {p.name}
            </Link>
          </span>
        ))}
      </span>
    </span>
  );
}
