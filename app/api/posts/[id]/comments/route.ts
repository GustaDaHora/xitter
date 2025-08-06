import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            iqScore: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const { content } = await req.json();
  const authorId = session.user.id;

  if (!content) {
    return NextResponse.json(
      { error: "Comment content is required" },
      { status: 400 },
    );
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId: id,
        authorId,
      },
    });
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 },
    );
  }
}
