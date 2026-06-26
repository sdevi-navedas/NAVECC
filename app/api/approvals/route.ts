import { NextResponse } from "next/server";
import { pendingApprovals } from "@/data/mockData";

export function GET() {
  return NextResponse.json(pendingApprovals);
}
