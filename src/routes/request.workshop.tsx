import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RequestPageLayout } from "@/components/request-page-layout";
import { RequesterFields, SafetyComplianceToggle, SubmitFooter, useBaseRequesterState, useSubmit } from "@/components/request-form-shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AGE_GROUPS, WORKSHOP_CATEGORY_LABEL } from "@/lib/constants";

export const Route = createFileRoute("/request/workshop")({
  component: WorkshopPage,
  head: () => ({ meta: [{ title: "STEM Workshop Request — Danny's Lab" }, { name: "description", content: "Register a group for a STEM workshop at Danny's Lab." }] }),
});

interface Workshop {
  id: string;
  title: string;
  category: string;
  age_min: number;
  age_max: number;
  duration_minutes: number;
}

function WorkshopPage() {
  const [base, update] = useBaseRequesterState();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [workshopId, setWorkshopId] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [attendees, setAttendees] = useState("1");
  const { submit, submitting } = useSubmit();

  useEffect(() => {
    supabase.from("workshops").select("id,title,category,age_min,age_max,duration_minutes").eq("is_archived", false).then(({ data }) => {
      setWorkshops((data ?? []) as Workshop[]);
    });
  }, []);

  const onSubmit = () =>
    submit({
      service_type: "workshop",
      ...base,
      workshop_id: workshopId,
      target_age_group: ageGroup,
      attendees_count: Number(attendees),
    });

  return (
    <RequestPageLayout
      eyebrow="STEM Workshops"
      title="Workshop Request"
      description="Register a group for one of our hands-on workshops in 3D design, electronics, or programming."
    >
      <div className="space-y-6">
        <RequesterFields state={base} update={update} />
        <div className="space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-6 elevation-1">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Workshop</h3>
          <div>
            <Label>Select a workshop *</Label>
            <Select value={workshopId} onValueChange={setWorkshopId}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Choose a workshop" /></SelectTrigger>
              <SelectContent>
                {workshops.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.title} — {WORKSHOP_CATEGORY_LABEL[w.category] ?? w.category} ({w.age_min}–{w.age_max} yrs)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Target age group *</Label>
              <Select value={ageGroup} onValueChange={setAgeGroup}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Pick a range" /></SelectTrigger>
                <SelectContent>
                  {AGE_GROUPS.map((a) => (<SelectItem key={a} value={a}>{a}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="att">Number of participants *</Label>
              <Input id="att" type="number" min={1} max={40} className="mt-1" value={attendees} onChange={(e) => setAttendees(e.target.value)} />
            </div>
          </div>
        </div>
        <SafetyComplianceToggle checked={base.safety_agreed} onChange={(v) => update("safety_agreed", v)} />
        <SubmitFooter base={base} onSubmit={onSubmit} submitting={submitting || !workshopId || !ageGroup} />
      </div>
    </RequestPageLayout>
  );
}
