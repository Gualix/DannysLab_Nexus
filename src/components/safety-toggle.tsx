import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";

interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function SafetyComplianceToggle({ checked, onChange }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 elevation-1">
      <div className="flex items-start gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div className="flex-1 space-y-1">
          <Label htmlFor="safety-toggle" className="text-base font-semibold">
            Safety & Compliance Commitment
          </Label>
          <p className="text-sm text-muted-foreground">
            I agree to follow Danny's Lab safety protocols, supervise minors at all times,
            respect equipment usage rules, and respond to communications in a timely manner.
          </p>
        </div>
        <Switch id="safety-toggle" checked={checked} onCheckedChange={onChange} />
      </div>
    </div>
  );
}
