import { NextResponse } from "next/server";
import { incidents } from "@/data/mockData";

export function GET() {
  return NextResponse.json(incidents);
}
