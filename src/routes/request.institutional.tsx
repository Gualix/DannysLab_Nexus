import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RequestPageLayout } from "@/components/request-page-layout";
import { RequesterFields, SafetyComplianceToggle, SubmitFooter, useBaseRequesterState, useSubmit } from "@/components/request-form-shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/request/institutional")({
  component: InstitutionalPage,
  head: () => ({ meta: [{ title: "Institutional Visits — Danny's Lab" }, { name: "description", content: "Schools and universities — coordinate a visit to Danny's Lab." }] }),
});

function InstitutionalPage() {
  const [base, update] = useBaseRequesterState();
  const [institution, setInstitution] = useState("");
  const [type, setType] = useState<"school" | "university" | "">("");
  const [attendees, setAttendees] = useState("10");
  const [purpose, setPurpose] = useState("");
  const [duration, setDuration] = useState("90");
  const { submit, submitting } = useSubmit();

  const onSubmit = () =>
    submit({
      service_type: "institutional",
      ...base,
      institution_name: institution,
      institution_type: type,
      attendees_count: Number(attendees),
      purpose,
      duration_minutes: Number(duration),
    });

  return (
    <RequestPageLayout
      eyebrow="Schools & Universities"
      title="Institutional Visit"
      description="A specialized portal for schools and universities visiting Danny's Lab."
    >
      <div className="space-y-6">
        <RequesterFields state={base} update={update} />
        <div className="space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-6 elevation-1">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Institution</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="inst">Institution name *</Label>
              <Input id="inst" className="mt-1" value={institution} onChange={(e) => setInstitution(e.target.value)} />
            </div>
            <div>
              <Label>Type *</Label>
              <Select value={type} onValueChange={(v) => setType(v as "school" | "university")}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="university">University</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="att">Group size *</Label>
              <Input id="att" type="number" min={1} max={200} className="mt-1" value={attendees} onChange={(e) => setAttendees(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="dur">Visit duration (minutes) *</Label>
              <Input id="dur" type="number" min={30} max={600} className="mt-1" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="purpose">Visit purpose *</Label>
            <Textarea id="purpose" rows={3} className="mt-1" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Curriculum focus, expected outcomes, special needs…" />
          </div>
        </div>
        <SafetyComplianceToggle checked={base.safety_agreed} onChange={(v) => update("safety_agreed", v)} />
        <SubmitFooter base={base} onSubmit={onSubmit} submitting={submitting || !type} />
      </div>
    </RequestPageLayout>
  );
}
