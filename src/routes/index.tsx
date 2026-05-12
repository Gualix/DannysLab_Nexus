import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { WednesdayReviewBanner } from "@/components/wednesday-banner";
import { Calendar, GraduationCap, Printer, Building2, ArrowRight, Clock } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Danny's Lab — Service Hub" },
      { name: "description", content: "Reserve lab space, register for STEM workshops, request fabrication services, and coordinate institutional visits at Danny's Lab." },
    ],
  }),
});

interface ServiceCard {
  title: string;
  description: string;
  to: "/request/lab-space" | "/request/workshop" | "/request/fabrication" | "/request/institutional";
  icon: typeof Calendar;
  accent: "primary" | "secondary" | "mirage" | "wildsand";
  tag: string;
}

const SERVICES: ServiceCard[] = [
  {
    title: "Lab Space Booking",
    description: "Reserve the makerspace for events, team workdays, or coordinated visits.",
    to: "/request/lab-space",
    icon: Calendar,
    accent: "primary",
    tag: "Events & Visits",
  },
  {
    title: "STEM Workshop Request",
    description: "Sign up groups for our curated workshops in 3D design, electronics & code.",
    to: "/request/workshop",
    icon: GraduationCap,
    accent: "secondary",
    tag: "Education",
  },
  {
    title: "3D Printing & Laser Cutting",
    description: "Custom fabrication, technical advisory, and prototyping support.",
    to: "/request/fabrication",
    icon: Printer,
    accent: "mirage",
    tag: "Fabrication",
  },
  {
    title: "Institutional Visits",
    description: "Tailored portal for schools, universities, and visiting cohorts.",
    to: "/request/institutional",
    icon: Building2,
    accent: "wildsand",
    tag: "Schools & Universities",
  },
];

const ACCENT_STYLES: Record<ServiceCard["accent"], { wrap: string; icon: string; tag: string }> = {
  primary: { wrap: "bg-primary text-primary-foreground", icon: "bg-white/15 text-white", tag: "bg-white/15 text-white" },
  secondary: { wrap: "bg-secondary text-secondary-foreground", icon: "bg-white/15 text-white", tag: "bg-white/15 text-white" },
  mirage: { wrap: "bg-mirage text-wildsand", icon: "bg-white/10 text-white", tag: "bg-white/10 text-white" },
  wildsand: { wrap: "bg-wildsand text-mirage border border-border", icon: "bg-mirage text-wildsand", tag: "bg-mirage/10 text-mirage" },
};

function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-wildsand via-background to-wildsand" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-24 md:pb-16">
            <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-mirage/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-mirage">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Makerspace Service Hub
                </span>
                <h1 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight text-foreground">
                  Build, prototype, and<br />learn at <span className="text-primary">Danny's Lab</span>.
                </h1>
                <p className="mt-5 max-w-xl text-base md:text-lg text-muted-foreground">
                  A high-tech makerspace for builders, students, and educators. Choose a service
                  below to send a request — our team responds every Wednesday.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 border border-border">
                    <Clock className="h-3.5 w-3.5" /> 15-day advance notice
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 border border-border">
                    Lab capacity 16
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 border border-border">
                    Reviews every Wednesday
                  </span>
                </div>
              </div>
              <div className="md:pb-4">
                <WednesdayReviewBanner />
              </div>
            </div>
          </div>
        </section>

        {/* Service cards */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid gap-5 sm:grid-cols-2">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              const style = ACCENT_STYLES[s.accent];
              return (
                <Link
                  key={s.title}
                  to={s.to}
                  className={`group relative overflow-hidden rounded-3xl p-6 sm:p-8 elevation-2 hover:elevation-4 transition-shadow state-layer ${style.wrap}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className={`grid h-12 w-12 place-items-center rounded-2xl ${style.icon}`}>
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className={`text-[10px] font-semibold uppercase tracking-widest rounded-full px-2.5 py-1 ${style.tag}`}>
                      {s.tag}
                    </span>
                  </div>
                  <h2 className="mt-6 text-2xl sm:text-3xl font-semibold tracking-tight">
                    {s.title}
                  </h2>
                  <p className="mt-2 text-sm sm:text-base opacity-85 max-w-md">
                    {s.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-medium">
                    Start request
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
