/* Downloads centre: shared labels and formatting (safe in browser code). */

export const DOWNLOAD_CATEGORIES = [
  "Prospectus",
  "Admissions & fees",
  "Calendars",
  "Uniform & supplies",
  "Forms",
  "Newsletters",
  "Policies",
  "Other",
];

export const ACCEPTED_FILES = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.zip";
export const MAX_FILE_BYTES = 10 * 1024 * 1024; // Cloudinary free-plan limit for raw files

export interface DownloadItem {
  id: string;
  title: string;
  description: string;
  category: string;
  fileType: string;
  fileSize: number | null;
  updatedAt: string;
}

export function fileTypeFrom(nameOrUrl: string): string {
  const clean = nameOrUrl.split("?")[0].split("#")[0];
  const m = clean.match(/\.([a-z0-9]{2,5})$/i);
  return m ? m[1].toLowerCase() : "";
}

export function fileTypeLabel(type: string): string {
  const t = type.toLowerCase();
  if (t === "pdf") return "PDF";
  if (t === "doc" || t === "docx") return "Word";
  if (t === "xls" || t === "xlsx" || t === "csv") return "Excel";
  if (t === "ppt" || t === "pptx") return "PowerPoint";
  if (["jpg", "jpeg", "png", "webp"].includes(t)) return "Image";
  if (t === "zip") return "ZIP";
  return t ? t.toUpperCase() : "File";
}

export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
