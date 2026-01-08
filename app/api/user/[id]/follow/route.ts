import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: targetUserId } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUserId = session.user.id;

  if (currentUserId === targetUserId) {
    return NextResponse.json(
      { error: "You cannot follow yourself" },
      { status: 400 },
    );
  }

  try {
    await prisma.follows.create({
      data: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    });

    return NextResponse.json({ message: "Followed successfully" });
  } catch (_error) {
    // Check for unique constraint violation (already following)
    // Prisma throws P2002 if unique constraint failed
    return NextResponse.json(
      { error: "Already following or internal error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: targetUserId } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentUserId = session.user.id;

  try {
    await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      },
    });

    return NextResponse.json({ message: "Unfollowed successfully" });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to unfollow" }, { status: 500 });
  }
}
