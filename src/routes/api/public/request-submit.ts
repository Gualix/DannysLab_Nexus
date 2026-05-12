import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { validateSubmission } from "@/lib/schemas";

export const Route = createFileRoute("/api/public/request-submit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const raw = await request.json();
          const data = validateSubmission(raw);

          const insertRow: Record<string, unknown> = {
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .insert(insertRow as any)
            .select("id")
            .single();

          if (error) {
            console.error("submit insert error", error);
            return new Response(JSON.stringify({ error: error.message }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ id: inserted.id }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Invalid request";
          return new Response(JSON.stringify({ error: message }), {
            status: 422,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
