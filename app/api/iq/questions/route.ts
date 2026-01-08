import { NextResponse } from "next/server";
import questions from "@/lib/iq-questions.json";

export async function GET() {
  // Shuffle questions using Fisher-Yates algorithm
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return NextResponse.json(shuffled);
}
