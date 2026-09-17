"use client";

import { useState } from "react";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-md px-2.5 py-1 text-[13px] font-medium text-code-ink/70 hover:bg-white/10 hover:text-code-ink"
    >
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}

export function CommandBlock({ command }: { command: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-code-bg py-2 pl-4 pr-2 font-mono text-[14px] text-code-ink">
      <code className="overflow-x-auto whitespace-nowrap">
        <span className="select-none text-code-ink/50">$ </span>
        {command}
      </code>
      <CopyButton text={command} />
    </div>
  );
}
