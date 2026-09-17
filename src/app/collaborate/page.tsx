import type { Metadata } from "next";
import Link from "next/link";
import { issueUrl } from "@/lib/repo";
import { getCollabItems, getContributor, getTool, formatDate, type CollabItem } from "@/lib/content";
import { Container } from "@/components/container";
import { ButtonLink, PageHeader, Tag } from "@/components/ui";
import { StatusDot } from "@/components/icons";

export const metadata: Metadata = {
  title: "Collaborate",
  description: "Open projects across the CoE that are looking for contributors.",
};

const columns: { status: CollabItem["status"]; title: string; tone: "wait" | "pass" | "muted"; hint: string }[] = [
  { status: "looking for help", title: "Looking for help", tone: "wait", hint: "Comment on the issue to claim it." },
  { status: "in progress", title: "In progress", tone: "pass", hint: "Ask the lead if you want to pair." },
  { status: "done", title: "Recently done", tone: "muted", hint: "Shipped by the community." },
];

export default function CollaboratePage() {
  const items = getCollabItems();
  const proposeUrl = issueUrl("project-proposal.yml") ?? "/contribute#propose-a-project";

  return (
    <Container>
      <PageHeader
        title="Collaborate"
        intro="Projects that need more hands. Each one has a lead who will help you get started, and most can be finished in a few days."
      >
        <ButtonLink href={proposeUrl}>Propose a project</ButtonLink>
      </PageHeader>

      <div className="grid gap-8 py-10 lg:grid-cols-3">
        {columns.map((col) => {
          const list = items.filter((i) => i.status === col.status);
          return (
            <section key={col.status} aria-labelledby={`col-${col.tone}`}>
              <h2 id={`col-${col.tone}`} className="flex items-center gap-2 font-semibold">
                <StatusDot tone={col.tone} />
                {col.title}
                <span className="text-sm font-normal text-muted">{list.length}</span>
              </h2>
              <p className="mt-1 text-sm text-muted">{col.hint}</p>
              <ul className="mt-4 space-y-3">
                {list.length === 0 && (
                  <li className="rounded-lg border border-dashed border-line p-4 text-sm text-muted">Nothing here right now.</li>
                )}
                {list.map((item) => {
                  const lead = getContributor(item.lead);
                  const tool = item.tool ? getTool(item.tool) : undefined;
                  return (
                    <li
                      key={item.slug}
                      id={item.slug}
                      className="scroll-mt-24 rounded-xl border border-line bg-surface p-5 target:border-signal target:ring-2 target:ring-signal/30"
                    >
                      <h3 className="font-semibold leading-snug">{item.title}</h3>
                      <p className="mt-1.5 text-[15px] text-muted">{item.summary}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.skills.map((s) => (
                          <Tag key={s}>{s}</Tag>
                        ))}
                      </div>
                      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-3 text-sm">
                        <div>
                          <dt className="text-muted">Lead</dt>
                          <dd>
                            {lead ? (
                              <Link href={`/community/${lead.slug}`} className="font-medium hover:text-signal">
                                {lead.name}
                              </Link>
                            ) : (
                              item.lead
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-muted">Effort</dt>
                          <dd className="capitalize">{item.effort}</dd>
                        </div>
                        {tool && (
                          <div>
                            <dt className="text-muted">Tool</dt>
                            <dd>
                              <Link href={`/tools/${tool.slug}`} className="font-medium hover:text-signal">
                                {tool.name}
                              </Link>
                            </dd>
                          </div>
                        )}
                        <div>
                          <dt className="text-muted">Opened</dt>
                          <dd>{formatDate(item.opened)}</dd>
                        </div>
                      </dl>
                      {item.issue && item.status !== "done" && (
                        <a href={item.issue} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-semibold text-signal hover:underline">
                          {item.status === "looking for help" ? "Claim this on GitHub" : "Follow progress on GitHub"}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </Container>
  );
}
