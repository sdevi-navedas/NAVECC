import { NextResponse } from "next/server";
import { getSignals } from "@/lib/agentEngine";

export function GET() {
  return NextResponse.json(getSignals());
}
