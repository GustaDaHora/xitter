import { NextResponse } from "next/server";
import questions from "@/lib/iq-questions.json";

export async function GET() {
  return NextResponse.json(questions);
}
