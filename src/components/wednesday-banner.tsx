import { Info } from "lucide-react";

export function WednesdayReviewBanner() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-secondary/20 bg-secondary/10 p-4 text-sm">
      <Info className="h-5 w-5 shrink-0 text-secondary" />
      <div>
        <p className="font-medium text-foreground">Reviews & responses every Wednesday</p>
        <p className="text-muted-foreground">
          All requests must be submitted at least <strong>15 days in advance</strong>. Our team
          reviews incoming requests every Wednesday and replies via email.
        </p>
      </div>
    </div>
  );
}
