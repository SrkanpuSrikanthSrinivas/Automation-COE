import { NextResponse } from "next/server";
import { buildFile, ValidationError } from "@/lib/contribution-build";
import { forms, type FormId } from "@/lib/contribution-forms";
import { checkPasscode, GitHubError, submissionsEnabled, submitContribution } from "@/lib/github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Small in-memory limit. Enough to stop accidental double posts and casual abuse. */
const recent = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(key: string) {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 500) recent.clear();
  return hits.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  if (!submissionsEnabled()) {
    return NextResponse.json({ error: "Submissions are not set up on this site yet." }, { status: 503 });
  }

  let payload: { type?: string; values?: Record<string, unknown>; passcode?: string; website?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Could not read the submission." }, { status: 400 });
  }

  // Honeypot: a real person never fills a hidden field.
  if (payload.website) return NextResponse.json({ error: "Submission rejected." }, { status: 400 });

  const type = payload.type as FormId;
  if (!type || !(type in forms)) return NextResponse.json({ error: "Unknown contribution type." }, { status: 400 });

  if (!checkPasscode(payload.passcode)) {
    return NextResponse.json({ error: "That contributor passcode isn’t right." }, { status: 401 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many submissions just now. Try again in a few minutes." }, { status: 429 });
  }

  try {
    const file = buildFile(type, payload.values ?? {});
    const author = String(payload.values?.authors ?? payload.values?.maintainers ?? payload.values?.lead ?? payload.values?.slug ?? "a visitor");
    const result = await submitContribution({ ...file, author });
    return NextResponse.json({ ...result, path: file.path });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: "Please fix these fields.", issues: error.issues }, { status: 422 });
    }
    if (error instanceof GitHubError) {
      const message =
        error.status === 422
          ? "Something with that name already exists. Try a different web address or handle."
          : error.status === 401 || error.status === 403
            ? "The site’s GitHub access isn’t working. A maintainer needs to check the token."
            : "GitHub couldn’t accept the submission just now. Please try again.";
      console.error(error);
      return NextResponse.json({ error: message }, { status: 502 });
    }
    console.error(error);
    return NextResponse.json({ error: "Something went wrong saving your contribution." }, { status: 500 });
  }
}
