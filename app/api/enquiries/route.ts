import { NextRequest, NextResponse } from "next/server";
import { requireDb, schema } from "../../../lib/db";
import { enquirySchema } from "../../../lib/enquiries";
import { notifyNewEnquiry } from "../../../lib/notify";

// Public endpoint for the website's contact, admissions and visit forms.

const recent = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function tooMany(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Please check the form and try again.";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }

  const { website, ...data } = parsed.data;
  // Bots fill the hidden field; pretend it worked so they move on.
  if (website) return NextResponse.json({ success: true });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (tooMany(ip)) {
    return NextResponse.json(
      { success: false, error: "You've sent several messages recently. Please try again later or call the school." },
      { status: 429 }
    );
  }

  try {
    const db = requireDb();
    const [enquiry] = await db
      .insert(schema.enquiries)
      .values({ ...data, details: data.details ?? {} })
      .returning();
    await notifyNewEnquiry(enquiry);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to save enquiry", err);
    return NextResponse.json(
      { success: false, error: "We couldn't send your message just now. Please call or email the school directly." },
      { status: 500 }
    );
  }
}
