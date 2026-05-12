import { z } from "zod";
import { isValidBookingDate } from "./date";
import { LAB_CAPACITY } from "./constants";

const baseRequester = {
  requester_name: z.string().trim().min(2).max(120),
  requester_email: z.string().trim().email().max(255),
  requester_phone: z.string().trim().max(40).optional().or(z.literal("")),
  affiliation: z.enum(["akamai", "external"]),
  akamai_pillars: z.array(z.string().min(1).max(60)).max(10).optional(),
  requested_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
    .refine((s) => isValidBookingDate(new Date(s + "T00:00:00")), {
      message: "Date must be at least 15 days from today",
    }),
  safety_agreed: z.literal(true, {
    errorMap: () => ({ message: "You must accept the safety protocols" }),
  }),
};

export const labSpaceSchema = z.object({
  service_type: z.literal("lab_space"),
  ...baseRequester,
  purpose: z.string().trim().min(10).max(1000),
  duration_minutes: z.coerce.number().int().min(30).max(600),
  attendees_count: z.coerce.number().int().min(1).max(LAB_CAPACITY, {
    message: `Maximum lab capacity is ${LAB_CAPACITY} attendees`,
  }),
  external_attendees: z.coerce.number().int().min(0).max(LAB_CAPACITY).default(0),
  waiver_agreed: z.boolean().default(false),
}).refine(
  (d) => (d.external_attendees > 0 ? d.waiver_agreed === true : true),
  { path: ["waiver_agreed"], message: "Image release waiver required when external attendees are present" },
);

export const workshopSchema = z.object({
  service_type: z.literal("workshop"),
  ...baseRequester,
  workshop_id: z.string().uuid(),
  target_age_group: z.string().min(1).max(60),
  attendees_count: z.coerce.number().int().min(1).max(40),
  purpose: z.string().trim().max(1000).optional(),
});

export const fabricationSchema = z.object({
  service_type: z.literal("fabrication"),
  ...baseRequester,
  fabrication_description: z.string().trim().min(10).max(2000),
  fabrication_quantity: z.coerce.number().int().min(1).max(500),
  file_url: z.string().trim().max(1000).optional().or(z.literal("")),
  purpose: z.string().trim().max(1000).optional(),
});

export const institutionalSchema = z.object({
  service_type: z.literal("institutional"),
  ...baseRequester,
  institution_name: z.string().trim().min(2).max(200),
  institution_type: z.enum(["school", "university"]),
  attendees_count: z.coerce.number().int().min(1).max(200),
  purpose: z.string().trim().min(10).max(1000),
  duration_minutes: z.coerce.number().int().min(30).max(600),
});

export const submitSchema = z.discriminatedUnion("service_type", [
  labSpaceSchema._def.schema ?? labSpaceSchema, // unwrap if refined
  workshopSchema,
  fabricationSchema,
  institutionalSchema,
]);

// Helper: produce a generic schema that validates any of the four
export function validateSubmission(input: unknown) {
  const obj = input as { service_type?: string };
  switch (obj?.service_type) {
    case "lab_space":
      return labSpaceSchema.parse(input);
    case "workshop":
      return workshopSchema.parse(input);
    case "fabrication":
      return fabricationSchema.parse(input);
    case "institutional":
      return institutionalSchema.parse(input);
    default:
      throw new Error("Unknown service_type");
  }
}
