import type { Metadata } from "next";
import { toolCategories } from "@/config/site";
import { getTools } from "@/lib/content";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/ui";
import { ToolFilter } from "@/components/tools/tool-filter";

export const metadata: Metadata = {
  title: "Tools",
  description: "Open-source test automation tools maintained by the CoE community.",
};

export default function ToolsPage() {
  const tools = getTools().map(({ slug, name, tagline, category, status, platforms }) => ({
    slug,
    name,
    tagline,
    category,
    status,
    platforms,
  }));
  return (
    <Container>
      <PageHeader
        title="Tools"
        intro="Open-source tools for web, mobile, and AI-assisted testing. Each one has a named maintainer and takes contributions."
      />
      <ToolFilter tools={tools} categories={toolCategories} />
    </Container>
  );
}
