"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { slugify, type Field, type FormDef } from "@/lib/contribution-forms";
import { MarkdownPreview } from "./markdown-preview";
import { Tag } from "@/components/ui";

type Values = Record<string, string | string[]>;
type Status =
  | { state: "editing" }
  | { state: "sending" }
  | { state: "error"; message: string; issues?: string[] }
  | { state: "done"; url: string; mode: "pr" | "direct" | "question" };

const inputClass =
  "w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-[15px] text-ink placeholder:text-muted/60 focus:border-signal";

export function ContributionForm({
  def,
  passcodeRequired,
  enabled,
  toolOptions,
  githubFallback,
}: {
  def: FormDef;
  passcodeRequired: boolean;
  enabled: boolean;
  toolOptions: string[];
  githubFallback: string | null;
}) {
  const [values, setValues] = useState<Values>(() =>
    Object.fromEntries(def.fields.map((f) => [f.name, f.type === "checkboxes" ? [] : ""])),
  );
  const [touchedSlug, setTouchedSlug] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [status, setStatus] = useState<Status>({ state: "editing" });

  const fields = useMemo(
    () => def.fields.map((f) => (f.name === "tool" ? { ...f, options: ["", ...toolOptions] } : f)),
    [def.fields, toolOptions],
  );

  function set(name: string, value: string | string[]) {
    setValues((v) => {
      const next = { ...v, [name]: value };
      const slugSource = def.fields.find((f) => f.slugOf)?.slugOf;
      if (!touchedSlug && slugSource && name === slugSource) next.slug = slugify(String(value));
      return next;
    });
  }

  const missing = def.fields
    .filter((f) => f.required && (Array.isArray(values[f.name]) ? !values[f.name].length : !String(values[f.name]).trim()))
    .map((f) => f.label);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: def.id, values, passcode, website: "" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ state: "error", message: data.error ?? "Something went wrong.", issues: data.issues });
        return;
      }
      setStatus({ state: "done", url: data.url, mode: data.mode });
    } catch {
      setStatus({ state: "error", message: "Could not reach the site. Check your connection and try again." });
    }
  }

  if (status.state === "done") {
    const isQuestion = status.mode === "question";
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-line bg-surface p-8 text-center">
        <p className="font-mono text-pass">{isQuestion ? "✓ sent" : "✓ submitted"}</p>
        <h2 className="h-section mt-3">Thank you</h2>
        <p className="mt-3 text-muted">
          {isQuestion
            ? "Your question is with the community. Answers appear on the thread below, so keep the link if you want to follow it."
            : status.mode === "direct"
              ? "Your contribution is saved and will appear on the site in about a minute."
              : "Your contribution was sent for review. A maintainer will take a look, and it goes live once merged."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex h-11 items-center rounded-lg bg-signal px-5 font-semibold text-signal-ink">
            Back to the site
          </Link>
          <a
            href={status.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center rounded-lg border border-line px-5 font-semibold"
          >
            {isQuestion ? "Follow the thread" : status.mode === "direct" ? "See the commit" : "Track the review"}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 pb-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <form onSubmit={submit} className="space-y-6">
        {!enabled && (
          <p className="rounded-lg border border-wait/50 bg-wait/10 px-4 py-3 text-[15px]">
            Submitting from the website isn’t switched on yet.{" "}
            {githubFallback ? (
              <>
                You can still{" "}
                <a href={githubFallback} target="_blank" rel="noreferrer" className="font-semibold text-signal underline">
                  add this file on GitHub
                </a>
                .
              </>
            ) : (
              "A maintainer needs to finish the setup."
            )}
          </p>
        )}

        {fields.map((field) => (
          <FieldControl
            key={field.name}
            field={field}
            value={values[field.name]}
            onChange={(v) => {
              if (field.name === "slug") setTouchedSlug(true);
              set(field.name, v);
            }}
          />
        ))}

        {passcodeRequired && (
          <label className="block">
            <span className="text-[15px] font-semibold">Contributor passcode</span>
            <span className="mt-0.5 block text-sm text-muted">Ask in the community channel if you don’t have it.</span>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className={`${inputClass} mt-2`}
              autoComplete="off"
              required
            />
          </label>
        )}

        {/* Honeypot: hidden from people, tempting to bots. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

        {status.state === "error" && (
          <div role="alert" className="rounded-lg border border-fail/50 bg-fail/10 px-4 py-3 text-[15px]">
            <p className="font-semibold">{status.message}</p>
            {status.issues && (
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {status.issues.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 border-t border-line pt-6">
          <button
            type="submit"
            disabled={!enabled || status.state === "sending" || missing.length > 0}
            className="inline-flex h-11 items-center rounded-lg bg-signal px-5 font-semibold text-signal-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status.state === "sending" ? "Sending…" : def.submitLabel}
          </button>
          {missing.length > 0 && (
            <p className="text-sm text-muted">
              Still needed: {missing.slice(0, 3).join(", ")}
              {missing.length > 3 && ` and ${missing.length - 3} more`}
            </p>
          )}
        </div>
        {githubFallback && enabled && (
          <p className="text-sm text-muted">
            Prefer GitHub?{" "}
            <a href={githubFallback} target="_blank" rel="noreferrer" className="font-medium text-signal hover:underline">
              {def.id === "ask-a-question" ? "Ask there instead" : "Do it on GitHub instead"}
            </a>
            .
          </p>
        )}
      </form>

      <aside className="lg:sticky lg:top-24">
        <h2 className="text-sm font-semibold text-muted">Preview</h2>
        <div className="mt-3 rounded-2xl border border-line bg-surface p-6">
          <Preview def={def} values={values} />
        </div>
      </aside>
    </div>
  );
}

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}) {
  const id = `field-${field.name}`;
  const text = typeof value === "string" ? value : "";
  const over = field.maxLength ? text.length > field.maxLength : false;

  return (
    <div>
      <label htmlFor={id} className="block text-[15px] font-semibold">
        {field.label}
        {!field.required && <span className="ml-2 font-normal text-muted">optional</span>}
      </label>
      {field.help && <p className="mt-0.5 text-sm text-muted">{field.help}</p>}

      {field.type === "checkboxes" ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {field.options?.map((option) => {
            const list = Array.isArray(value) ? value : [];
            const checked = list.includes(option);
            return (
              <label
                key={option}
                className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[15px] ${
                  checked ? "border-signal bg-signal/10 font-medium text-signal" : "border-line text-muted"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => onChange(checked ? list.filter((o) => o !== option) : [...list, option])}
                />
                {option}
              </label>
            );
          })}
        </div>
      ) : field.type === "select" ? (
        <select id={id} value={text} onChange={(e) => onChange(e.target.value)} className={`${inputClass} mt-2`}>
          <option value="">{field.required ? "Choose one" : "None"}</option>
          {field.options?.filter(Boolean).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : field.type === "markdown" || field.type === "textarea" ? (
        <textarea
          id={id}
          value={text}
          rows={field.type === "markdown" ? 16 : 3}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={`${inputClass} mt-2 ${field.type === "markdown" ? "font-mono text-[14px] leading-relaxed" : ""}`}
        />
      ) : (
        <input
          id={id}
          type={field.type === "url" ? "url" : "text"}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={`${inputClass} mt-2`}
        />
      )}

      {field.maxLength && (
        <p className={`mt-1 text-sm ${over ? "text-fail" : "text-muted"}`}>
          {text.length} of {field.maxLength} characters
        </p>
      )}
    </div>
  );
}

const asList = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value : String(value ?? "").split(",").map((s) => s.trim()).filter(Boolean);

function Preview({ def, values }: { def: FormDef; values: Values }) {
  const title = String(values.title || values.name || "");
  const summary = String(values.summary || values.tagline || values.bio || values.role || "");
  const body = String(values.body ?? "");

  if (!title && !summary && !body) {
    return <p className="text-muted">Start typing and your {def.id === "add-your-profile" ? "profile" : "page"} appears here.</p>;
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold leading-snug tracking-tight">{title || "Untitled"}</h3>
      {summary && <p className="mt-2 text-muted">{summary}</p>}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {[...asList(values.tags), ...asList(values.skills), ...asList(values.platforms), ...asList(values.openTo)].map(
          (t) => (
            <Tag key={t}>{t}</Tag>
          ),
        )}
      </div>
      {values.slug && (
        <p className="mt-3 font-mono text-[13px] text-muted">
          /{def.id === "write-a-post" ? "blog" : def.id === "add-a-tool" ? "tools" : "community"}/{String(values.slug)}
        </p>
      )}
      {body && (
        <div className="prose prose-coe mt-5 max-w-none border-t border-line pt-5 prose-h2:mt-6 prose-h2:text-xl">
          <MarkdownPreview source={body} />
        </div>
      )}
    </div>
  );
}
