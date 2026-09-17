"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Contributor } from "@/lib/content";
import { Avatar } from "@/components/avatar";
import { Tag } from "@/components/ui";

const openToLabels: Record<string, string> = {
  mentoring: "Mentoring",
  pairing: "Pairing",
  speaking: "Speaking",
  reviewing: "Reviewing",
  "co-authoring": "Co-authoring",
};

export function Directory({ people, addProfileHref }: { people: Contributor[]; addProfileHref: string }) {
  const [skill, setSkill] = useState("");
  const [openTo, setOpenTo] = useState("");

  const skills = useMemo(() => [...new Set(people.flatMap((p) => p.skills))].sort(), [people]);
  const visible = people.filter(
    (p) => (!skill || p.skills.includes(skill)) && (!openTo || p.openTo.includes(openTo as Contributor["openTo"][number])),
  );

  const select =
    "h-10 rounded-lg border border-line bg-surface px-3 text-[15px] text-ink min-w-44";

  return (
    <>
      <div className="flex flex-wrap items-end gap-4 py-8">
        <label className="grid gap-1.5 text-sm font-semibold">
          Skill
          <select value={skill} onChange={(e) => setSkill(e.target.value)} className={select}>
            <option value="">Any skill</option>
            {skills.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">
          Open to
          <select value={openTo} onChange={(e) => setOpenTo(e.target.value)} className={select}>
            <option value="">Anything</option>
            {Object.entries(openToLabels).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <p className="pb-2 text-sm text-muted" aria-live="polite">
          {visible.length} of {people.length} {people.length === 1 ? "member" : "members"}
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/community/${p.slug}`}
              className="group flex h-full flex-col rounded-xl border border-line bg-surface p-5 hover:border-signal"
            >
              <span className="flex items-center gap-3">
                <Avatar name={p.name} size={44} />
                <span>
                  <span className="block font-semibold group-hover:text-signal">{p.name}</span>
                  <span className="block text-sm text-muted">{p.role}</span>
                </span>
              </span>
              <span className="mt-3 line-clamp-3 text-[15px] text-muted">{p.bio}</span>
              <span className="mt-auto flex flex-wrap gap-1.5 pt-4">
                {p.skills.slice(0, 4).map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </span>
              {p.openTo.length > 0 && (
                <span className="mt-3 text-sm text-pass">
                  Open to {p.openTo.map((o) => openToLabels[o].toLowerCase()).join(", ")}
                </span>
              )}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href={addProfileHref}
            {...(addProfileHref.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
            className="flex h-full min-h-48 flex-col justify-center rounded-xl border border-dashed border-line p-5 text-center hover:border-signal"
          >
            <span className="font-semibold">Add your profile</span>
            <span className="mt-1 text-sm text-muted">Opens a ready-made profile file on GitHub.</span>
          </Link>
        </li>
      </ul>
    </>
  );
}
