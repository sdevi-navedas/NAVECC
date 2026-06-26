import { NextResponse } from "next/server";
import { kpi } from "@/data/mockData";

export function GET() {
  return NextResponse.json(kpi);
}
