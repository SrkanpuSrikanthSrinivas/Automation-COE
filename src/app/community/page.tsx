import type { Metadata } from "next";
import { getContributors } from "@/lib/content";
import { Container } from "@/components/container";
import { ButtonLink, PageHeader } from "@/components/ui";
import { Directory } from "@/components/community/directory";

export const metadata: Metadata = {
  title: "Community",
  description: "Find testers and automation engineers to learn from, pair with, and build alongside.",
};

export default function CommunityPage() {
  const addProfile = "/contribute/add-your-profile";
  return (
    <Container>
      <PageHeader
        title="Community"
        intro="Find people to learn from, pair with, and build alongside. Filter by skill or by what someone is open to."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={addProfile}>Add your profile</ButtonLink>
          <ButtonLink href="/contribute/ask-a-question" variant="secondary">
            Ask a question
          </ButtonLink>
          <ButtonLink href="/contribute" variant="quiet">
            How contributing works
          </ButtonLink>
        </div>
      </PageHeader>
      <Directory people={getContributors()} addProfileHref={addProfile} />
    </Container>
  );
}
