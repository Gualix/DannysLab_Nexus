import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { validateSubmission } from "@/lib/schemas";

interface ServiceRequest {
  service_type: string;
  requester_name: string;
  requester_email: string;
  requester_phone: string | null;
  affiliation: string;
  akamai_pillars: string[] | null;
  requested_date: string;
  safety_agreed: boolean;
  purpose: string | null;
  duration_minutes: number | null;
  attendees_count: number | null;
  external_attendees: number | null;
  waiver_agreed: boolean;
  workshop_id: string | null;
  target_age_group: string | null;
  fabrication_description: string | null;
  fabrication_quantity: number | null;
  file_url: string | null;
  institution_name: string | null;
  institution_type: string | null;
}

export const Route = createFileRoute("/api/public/request-submit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const raw = await request.json();
          const data = validateSubmission(raw);

          const insertRow: ServiceRequest = {
            service_type: data.service_type,
            requester_name: data.requester_name,
            requester_email: data.requester_email,
            requester_phone: data.requester_phone || null,
            affiliation: data.affiliation,
            akamai_pillars: data.affiliation === "akamai" ? (data.akamai_pillars ?? []) : null,
            requested_date: data.requested_date,
            safety_agreed: data.safety_agreed,
            purpose: (data as { purpose?: string }).purpose || null,
            duration_minutes: (data as { duration_minutes?: number }).duration_minutes ?? null,
            attendees_count: (data as { attendees_count?: number }).attendees_count ?? null,
            external_attendees: (data as { external_attendees?: number }).external_attendees ?? null,
            waiver_agreed: (data as { waiver_agreed?: boolean }).waiver_agreed ?? false,
            workshop_id: (data as { workshop_id?: string }).workshop_id ?? null,
            target_age_group: (data as { target_age_group?: string }).target_age_group ?? null,
            fabrication_description: (data as { fabrication_description?: string }).fabrication_description ?? null,
            fabrication_quantity: (data as { fabrication_quantity?: number }).fabrication_quantity ?? null,
            file_url: (data as { file_url?: string }).file_url || null,
            institution_name: (data as { institution_name?: string }).institution_name ?? null,
            institution_type: (data as { institution_type?: string }).institution_type ?? null,
          };

          const { data: inserted, error } = await supabaseAdmin
            .from("service_requests")
            .insert(insertRow)
            .select("id")
            .single();

          if (error) {
            console.error("[API] Database insert error:", {
              code: error.code,
              message: error.message,
              details: error.details,
              hint: error.hint,
            });
            return new Response(
              JSON.stringify({
                error: "Failed to submit request",
                details: error.message,
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          console.info("[API] Service request submitted successfully:", {
            id: inserted.id,
            service_type: data.service_type,
            requester_email: data.requester_email,
          });

          return new Response(JSON.stringify({ id: inserted.id }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Invalid request";
          console.error("[API] Request submission error:", {
            error: message,
            stack: err instanceof Error ? err.stack : undefined,
          });

          return new Response(
            JSON.stringify({
              error: "Invalid request",
              details: message,
            }),
            {
              status: 422,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      },
    },
  },
});
