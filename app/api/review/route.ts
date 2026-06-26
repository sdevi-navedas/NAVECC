import { NextResponse } from "next/server";
import { submitReview } from "@/lib/agentEngine";

export async function POST(request: Request) {
  const body = await request.json();
  const { incidentId, decision, rootCause, evidence, notes } = body;

  if (!incidentId || !decision) {
    return NextResponse.json({ error: "incidentId and decision are required" }, { status: 400 });
  }

  submitReview({ incidentId, decision, rootCause, evidence, notes: notes ?? "" });
  return NextResponse.json({ ok: true });
}
