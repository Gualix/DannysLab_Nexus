/** T-15 booking constraint helpers */
export const MIN_LEAD_DAYS = 15;

export function minBookingDate(from: Date = new Date()): Date {
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + MIN_LEAD_DAYS);
  return d;
}

export function isValidBookingDate(date: Date): boolean {
  const min = minBookingDate();
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime() >= min.getTime();
}

export function formatDateISO(date: Date): string {
  return date.toISOString().split("T")[0];
}
