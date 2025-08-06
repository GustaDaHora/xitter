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

  const score = questions.reduce((acc, question, index) => {
    if (question.answer === answers[index]) {
      return acc + 10;
    }
    return acc;
  }, 0);

  const iq = Math.round(score * 1.5);

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
