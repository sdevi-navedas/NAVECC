import { NextResponse } from "next/server";
import { rootCauses } from "@/data/mockData";

export function GET() {
  return NextResponse.json(rootCauses);
}
