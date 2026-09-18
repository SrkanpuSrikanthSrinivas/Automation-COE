import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { forms, type FormId } from "@/lib/contribution-forms";
import { getContributionTypes } from "@/lib/contribution-templates";
import { getTools } from "@/lib/content";
import { passcodeRequired, submissionsEnabled } from "@/lib/github";
import { askUrl } from "@/lib/repo";
import { Container } from "@/components/container";
import { ContributionForm } from "@/components/contribute/form";

type Props = { params: Promise<{ type: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(forms).map((type) => ({ type }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const def = forms[(await params).type as FormId];
  return def ? { title: def.title, description: def.intro } : {};
}

export default async function ContributionFormPage({ params }: Props) {
  const { type } = await params;
  const def = forms[type as FormId];
  if (!def) notFound();

  const githubFallback =
    def.id === "ask-a-question"
      ? askUrl
      : (getContributionTypes().find((t) => t.id === def.id)?.primary.href ?? null);

  return (
    <Container className="py-12 sm:py-16">
      <Link href="/contribute" className="text-sm text-muted hover:text-ink">
        Contribute
      </Link>
      <h1 className="h-page mt-3">{def.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">{def.intro}</p>
      <div className="mt-10">
        <ContributionForm
          def={def}
          enabled={submissionsEnabled()}
          passcodeRequired={passcodeRequired}
          toolOptions={getTools().map((t) => t.slug)}
          githubFallback={githubFallback}
        />
      </div>
    </Container>
  );
}
