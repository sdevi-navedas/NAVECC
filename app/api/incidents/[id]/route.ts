import { NextResponse } from "next/server";
import { getIncidentById, auditLog } from "@/data/mockData";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const incident = getIncidentById(id);

  if (!incident) {
    return NextResponse.json({ error: "Incident not found" }, { status: 404 });
  }

  const auditEntries = auditLog.filter((e) => e.incidentId === incident.id);

  return NextResponse.json({ incident, auditEntries });
}
