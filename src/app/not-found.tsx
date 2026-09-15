import { Container } from "@/components/container";
import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-24">
      <p className="font-mono text-sm text-fail">✕ expected page to exist, received 404</p>
      <h1 className="h-page mt-4">This page isn’t here</h1>
      <p className="mt-3 max-w-lg text-muted">
        It may have been renamed or removed. Check the address, or start from one of these.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/">Go to the home page</ButtonLink>
        <ButtonLink href="/tools" variant="secondary">
          Browse tools
        </ButtonLink>
      </div>
    </Container>
  );
}
