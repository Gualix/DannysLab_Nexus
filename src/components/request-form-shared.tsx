import { useState, ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { T15DatePicker } from "@/components/t15-date-picker";
import { SafetyComplianceToggle } from "@/components/safety-toggle";
import { AffiliationFieldset } from "@/components/affiliation-fieldset";

export interface BaseRequesterState {
  requester_name: string;
  requester_email: string;
  requester_phone: string;
  affiliation: "akamai" | "external" | "";
  akamai_pillars: string[];
  requested_date: string;
  safety_agreed: boolean;
}

export function useBaseRequesterState(): [BaseRequesterState, <K extends keyof BaseRequesterState>(k: K, v: BaseRequesterState[K]) => void] {
  const [state, setState] = useState<BaseRequesterState>({
    requester_name: "",
    requester_email: "",
    requester_phone: "",
    affiliation: "",
    akamai_pillars: [],
    requested_date: "",
    safety_agreed: false,
  });
  const update = <K extends keyof BaseRequesterState>(k: K, v: BaseRequesterState[K]) =>
    setState((s) => ({ ...s, [k]: v }));
  return [state, update];
}

interface RequesterFieldsProps {
  state: BaseRequesterState;
  update: <K extends keyof BaseRequesterState>(k: K, v: BaseRequesterState[K]) => void;
}

export function RequesterFields({ state, update }: RequesterFieldsProps) {
  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-6 elevation-1">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Your details</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Full name *</Label>
          <Input id="name" value={state.requester_name} onChange={(e) => update("requester_name", e.target.value)} className="mt-1" required />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" value={state.requester_email} onChange={(e) => update("requester_email", e.target.value)} className="mt-1" required />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={state.requester_phone} onChange={(e) => update("requester_phone", e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label>Requested date *</Label>
          <div className="mt-1">
            <T15DatePicker value={state.requested_date} onChange={(v) => update("requested_date", v)} />
          </div>
        </div>
      </div>
      <AffiliationFieldset
        affiliation={state.affiliation}
        onAffiliationChange={(v) => update("affiliation", v)}
        pillars={state.akamai_pillars}
        onPillarsChange={(p) => update("akamai_pillars", p)}
      />
    </div>
  );
}

export function SubmitFooter({
  base,
  children,
  onSubmit,
  submitting,
}: {
  base: BaseRequesterState;
  children?: ReactNode;
  onSubmit: () => Promise<void> | void;
  submitting: boolean;
}) {
  const canSubmit =
    base.safety_agreed &&
    base.requester_name.trim().length > 1 &&
    base.requester_email.includes("@") &&
    base.requested_date &&
    base.affiliation;

  return (
    <div className="space-y-5">
      {children}
      <Button
        type="button"
        size="lg"
        disabled={!canSubmit || submitting}
        onClick={() => onSubmit()}
        className="w-full rounded-xl elevation-2 hover:elevation-3 transition-shadow"
      >
        {submitting ? "Submitting…" : "Submit request"}
      </Button>
    </div>
  );
}

export async function submitRequest(payload: Record<string, unknown>) {
  const res = await fetch("/api/public/request-submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = (await res.json()) as { id?: string; error?: string };
  if (!res.ok || !json.id) {
    throw new Error(json.error || "Submission failed");
  }
  return json.id;
}

export function useSubmit() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const submit = async (payload: Record<string, unknown>) => {
    setSubmitting(true);
    try {
      const id = await submitRequest(payload);
      toast.success("Request submitted! Check your email for confirmation details.");
      navigate({ to: "/request/success/$id", params: { id } });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };
  return { submit, submitting };
}

export { SafetyComplianceToggle };
