import { NextResponse } from "next/server";
import { getAgents } from "@/lib/agentEngine";

export function GET() {
  return NextResponse.json(getAgents());
}
