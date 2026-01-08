import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import questions from "@/lib/iq-questions.json";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { answers } = await req.json();
  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { iqTestDate: true },
  });

  if (user?.iqTestDate) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    if (user.iqTestDate > thirtyDaysAgo) {
      return NextResponse.json(
        { error: "You can only take the IQ test once every 30 days." },
        { status: 403 },
      );
    }
  }

  // Expecting answers to be a Record<string, string> mapping questionId -> answer

  // Create a map of questions for easy lookup
  const questionsMap = new Map(questions.map((q) => [q.id, q]));

  let correctCount = 0;

  // If answers is an object (map)
  for (const [questionId, userAnswer] of Object.entries(answers)) {
    const question = questionsMap.get(questionId);
    if (question && question.answer === userAnswer) {
      correctCount++;
    }
  }

  // Parody Scoring Logic
  // Min = Total Points (1 point per correct answer)
  // Max = Correct * 9
  // Random between Min and Max

  const minScore = correctCount;
  const maxScore = correctCount * 9;

  // Handle case where correctCount is 0 to avoid range issues (though random(0,0) is 0)
  const iq = Math.floor(Math.random() * (maxScore - minScore + 1)) + minScore;

  await prisma.user.update({
    where: { id: userId },
    data: { iqScore: iq, iqTestDate: new Date() },
  });

  await prisma.iQTestSubmission.create({
    data: {
      userId,
      score: iq,
      submittedAt: new Date(),
    },
  });

  return NextResponse.json({ iq });
}
