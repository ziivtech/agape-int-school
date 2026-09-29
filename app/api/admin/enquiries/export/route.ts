import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { requireDb, schema } from "../../../../../lib/db";
import { handle, logActivity, requireArea } from "../../../../../lib/auth/server";
import { STATUS_LABELS, TYPE_LABELS } from "../../../../../lib/enquiries";

export const dynamic = "force-dynamic";

function csvCell(value: unknown) {
  const s = value === null || value === undefined ? "" : String(value);
  // Neutralise spreadsheet formulas and quote everything.
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

export const GET = handle(async () => {
  const session = await requireArea("enquiries");
  const rows = await requireDb()
    .select({ e: schema.enquiries, owner: schema.users.name })
    .from(schema.enquiries)
    .leftJoin(schema.users, eq(schema.enquiries.assignedTo, schema.users.id))
    .orderBy(desc(schema.enquiries.createdAt));

  const header = ["Received", "Type", "Status", "Name", "Email", "Phone", "Student", "Level", "Starting", "Subject", "Message", "Details", "Assigned to", "Page"];
  const lines = rows.map(({ e, owner }) =>
    [
      new Date(e.createdAt).toISOString().slice(0, 16).replace("T", " "),
      TYPE_LABELS[e.type],
      STATUS_LABELS[e.status],
      e.name,
      e.email,
      e.phone,
      e.studentName,
      e.gradeOfInterest,
      e.entryYear,
      e.subject,
      e.message,
      Object.entries(e.details ?? {})
        .map(([k, v]) => `${k}: ${v}`)
        .join("; "),
      owner,
      e.sourcePage,
    ]
      .map(csvCell)
      .join(",")
  );

  await logActivity(session.userId, "export", "enquiry", null, `Exported ${rows.length} enquiries`);
  const csv = "﻿" + [header.map(csvCell).join(","), ...lines].join("\r\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="agape-enquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
});
