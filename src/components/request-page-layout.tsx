import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { WednesdayReviewBanner } from "@/components/wednesday-banner";
import { ArrowLeft } from "lucide-react";

interface Props {
  title: string;
  eyebrow: string;
  description: string;
  children: ReactNode;
}

export function RequestPageLayout({ title, eyebrow, description, children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to hub
        </Link>
        <div className="mt-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">{title}</h1>
          <p className="mt-3 text-base text-muted-foreground max-w-2xl">{description}</p>
        </div>
        <div className="mt-6">
          <WednesdayReviewBanner />
        </div>
        <div className="mt-8">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
