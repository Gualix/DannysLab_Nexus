import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AKAMAI_PILLARS } from "@/lib/constants";

interface Props {
  affiliation: "akamai" | "external" | "";
  onAffiliationChange: (v: "akamai" | "external") => void;
  pillars: string[];
  onPillarsChange: (p: string[]) => void;
}

export function AffiliationFieldset({ affiliation, onAffiliationChange, pillars, onPillarsChange }: Props) {
  const togglePillar = (p: string) => {
    onPillarsChange(pillars.includes(p) ? pillars.filter((x) => x !== p) : [...pillars, p]);
  };
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Affiliation</Label>
        <RadioGroup
          value={affiliation || undefined}
          onValueChange={(v) => onAffiliationChange(v as "akamai" | "external")}
          className="mt-2 grid gap-2 sm:grid-cols-2"
        >
          <label
            htmlFor="aff-akamai"
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-3 hover:bg-muted state-layer"
          >
            <RadioGroupItem id="aff-akamai" value="akamai" />
            <span className="text-sm font-medium">Akamai Collaborator</span>
          </label>
          <label
            htmlFor="aff-external"
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-3 hover:bg-muted state-layer"
          >
            <RadioGroupItem id="aff-external" value="external" />
            <span className="text-sm font-medium">External Guest</span>
          </label>
        </RadioGroup>
      </div>
      {affiliation === "akamai" && (
        <div className="rounded-xl border border-border bg-card p-4">
          <Label className="text-sm font-medium">Associated Pillars</Label>
          <p className="text-xs text-muted-foreground">Select all that apply.</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {AKAMAI_PILLARS.map((p) => (
              <label key={p} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={pillars.includes(p)} onCheckedChange={() => togglePillar(p)} />
                {p}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
