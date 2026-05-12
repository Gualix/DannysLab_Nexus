import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RequestPageLayout } from "@/components/request-page-layout";
import { RequesterFields, SafetyComplianceToggle, SubmitFooter, useBaseRequesterState, useSubmit } from "@/components/request-form-shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { LAB_CAPACITY } from "@/lib/constants";

export const Route = createFileRoute("/request/lab-space")({
  component: LabSpacePage,
  head: () => ({ meta: [{ title: "Lab Space Booking — Danny's Lab" }, { name: "description", content: "Reserve Danny's Lab makerspace for events and coordinated visits." }] }),
});

function LabSpacePage() {
  const [base, update] = useBaseRequesterState();
  const [purpose, setPurpose] = useState("");
  const [duration, setDuration] = useState("60");
  const [attendees, setAttendees] = useState("1");
  const [external, setExternal] = useState("0");
  const [waiver, setWaiver] = useState(false);
  const { submit, submitting } = useSubmit();

  const attendeesNum = Number(attendees) || 0;
  const externalNum = Number(external) || 0;
  const overCapacity = attendeesNum > LAB_CAPACITY;
  const needsWaiver = externalNum > 0;

  const onSubmit = () =>
    submit({
      service_type: "lab_space",
      ...base,
      purpose,
      duration_minutes: Number(duration),
      attendees_count: attendeesNum,
      external_attendees: externalNum,
      waiver_agreed: waiver,
    });

  return (
    <RequestPageLayout
      eyebrow="Lab Space"
      title="Lab Space Booking"
      description="Reserve the makerspace for an event, workday, or coordinated visit."
    >
      <div className="space-y-6">
        <RequesterFields state={base} update={update} />
        <div className="space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-6 elevation-1">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Booking details</h3>
          <div>
            <Label htmlFor="purpose">Purpose *</Label>
            <Textarea id="purpose" className="mt-1" rows={3} value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="What will you be doing in the lab?" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input id="duration" type="number" min={30} max={600} className="mt-1" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="att">Total attendees *</Label>
              <Input id="att" type="number" min={1} max={LAB_CAPACITY} className="mt-1" value={attendees} onChange={(e) => setAttendees(e.target.value)} />
              {overCapacity && <p className="mt-1 text-xs text-destructive">Maximum lab capacity is {LAB_CAPACITY}.</p>}
            </div>
            <div>
              <Label htmlFor="ext">External attendees</Label>
              <Input id="ext" type="number" min={0} max={LAB_CAPACITY} className="mt-1" value={external} onChange={(e) => setExternal(e.target.value)} />
            </div>
          </div>
          {needsWaiver && (
            <label className="flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm">
              <Checkbox checked={waiver} onCheckedChange={(c) => setWaiver(Boolean(c))} className="mt-0.5" />
              <span>
                I accept the legal waiver and image-release notice for external attendees on behalf of all guests.
              </span>
            </label>
          )}
        </div>
        <SafetyComplianceToggle checked={base.safety_agreed} onChange={(v) => update("safety_agreed", v)} />
        <SubmitFooter base={base} onSubmit={onSubmit} submitting={submitting || overCapacity || (needsWaiver && !waiver)} />
      </div>
    </RequestPageLayout>
  );
}
