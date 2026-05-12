import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/request/success/$id")({
  component: SuccessPage,
  head: () => ({ meta: [{ title: "Request received — Danny's Lab" }] }),
});

function SuccessPage() {
  const { id } = Route.useParams();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl border border-border bg-card p-8 elevation-2 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">Request received</h1>
          <p className="mt-3 text-muted-foreground">
            Thank you. Your request has been logged with reference{" "}
            <span className="font-mono text-foreground">{id.slice(0, 8)}</span>.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Our team reviews requests every Wednesday and will reply by email.
          </p>
          <div className="mt-6">
            <Button asChild className="rounded-xl"><Link to="/">Back to hub</Link></Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
