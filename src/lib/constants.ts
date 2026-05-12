export const LAB_CAPACITY = 16;

export const AKAMAI_PILLARS = [
  "Branding",
  "Wellness",
  "Sustainability",
  "Innovation",
  "Community",
  "Education",
] as const;

export const AGE_GROUPS = [
  "6–8 years",
  "9–11 years",
  "12–14 years",
  "15–17 years",
  "18+ years",
  "Mixed ages",
] as const;

export const WORKSHOP_CATEGORY_LABEL: Record<string, string> = {
  "3d_design": "3D Design",
  electronics: "Electronics",
  programming: "Programming",
  other: "Other",
};

export const SERVICE_TYPE_LABEL: Record<string, string> = {
  lab_space: "Lab Space Booking",
  workshop: "STEM Workshop",
  fabrication: "3D Printing & Laser Cutting",
  institutional: "Institutional Visit",
};

export const STATUS_LABEL: Record<string, string> = {
  pending: "Pending Review",
  approved: "Approved",
  rescheduled: "Rescheduled",
  rejected: "Rejected",
};
