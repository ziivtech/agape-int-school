/* Enquiry labels, safe to import in browser code. */

export const ENQUIRY_TYPES = ["general", "admissions", "visit", "alumni"] as const;

export const ENQUIRY_STATUSES = ["new", "contacted", "visit_booked", "applied", "enrolled", "closed"] as const;

export const STATUS_LABELS: Record<(typeof ENQUIRY_STATUSES)[number], string> = {
  new: "New",
  contacted: "Contacted",
  visit_booked: "Visit booked",
  applied: "Applied",
  enrolled: "Enrolled",
  closed: "Closed",
};

export const TYPE_LABELS: Record<(typeof ENQUIRY_TYPES)[number], string> = {
  general: "General",
  admissions: "Admissions",
  visit: "Campus visit",
  alumni: "Alumni",
};
