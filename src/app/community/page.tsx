import type { Metadata } from "next";
import { site } from "@/config/site";
import { getContributors } from "@/lib/content";
import { Container } from "@/components/container";
import { ButtonLink, PageHeader } from "@/components/ui";
import { Directory } from "@/components/community/directory";

export const metadata: Metadata = {
  title: "Community",
  description: "Find testers and automation engineers to learn from, pair with, and build alongside.",
};

export default function CommunityPage() {
  return (
    <Container>
      <PageHeader
        title="Community"
        intro="Find people to learn from, pair with, and build alongside. Filter by skill or by what someone is open to."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={site.discussions}>Join the discussion</ButtonLink>
          <ButtonLink href="/contribute#add-your-profile" variant="secondary">
            Add your profile
          </ButtonLink>
        </div>
      </PageHeader>
      <Directory people={getContributors()} />
    </Container>
  );
}
