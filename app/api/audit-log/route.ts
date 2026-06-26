import { NextResponse } from "next/server";
import { getAuditLog } from "@/lib/agentEngine";

export function GET() {
  return NextResponse.json(getAuditLog());
}
