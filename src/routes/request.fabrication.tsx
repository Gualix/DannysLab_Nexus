import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RequestPageLayout } from "@/components/request-page-layout";
import { RequesterFields, SafetyComplianceToggle, SubmitFooter, useBaseRequesterState, useSubmit } from "@/components/request-form-shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/request/fabrication")({
  component: FabricationPage,
  head: () => ({ meta: [{ title: "3D Printing & Laser Cutting — Danny's Lab" }, { name: "description", content: "Request custom 3D printing or laser-cutting work and technical advisory." }] }),
});

function FabricationPage() {
  const [base, update] = useBaseRequesterState();
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [fileUrl, setFileUrl] = useState("");
  const { submit, submitting } = useSubmit();

  const onSubmit = () =>
    submit({
      service_type: "fabrication",
      ...base,
      fabrication_description: description,
      fabrication_quantity: Number(quantity),
      file_url: fileUrl,
    });

  return (
    <RequestPageLayout
      eyebrow="Fabrication"
      title="3D Printing & Laser Cutting"
      description="Describe your object and share a link to your design file (.STL, .OBJ, .SVG, .DXF, .AI, .PDF)."
    >
      <div className="space-y-6">
        <RequesterFields state={base} update={update} />
        <div className="space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-6 elevation-1">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Project</h3>
          <div>
            <Label htmlFor="desc">Object description *</Label>
            <Textarea id="desc" rows={4} className="mt-1" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Material, dimensions, color, finish, deadline…" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="qty">Quantity *</Label>
              <Input id="qty" type="number" min={1} max={500} className="mt-1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="file">File link (Drive / Dropbox / URL)</Label>
              <Input id="file" type="url" className="mt-1" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="https://…" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Share a publicly accessible link to your <strong>.STL</strong> or vector file. We'll
            confirm feasibility and lead time during review.
          </p>
        </div>
        <SafetyComplianceToggle checked={base.safety_agreed} onChange={(v) => update("safety_agreed", v)} />
        <SubmitFooter base={base} onSubmit={onSubmit} submitting={submitting} />
      </div>
    </RequestPageLayout>
  );
}
