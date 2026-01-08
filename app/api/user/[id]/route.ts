import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        posts: {
          orderBy: { createdAt: "desc" },
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
        },
        _count: {
          select: {
            followedBy: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let isFollowing = false;
    if (currentUserId && currentUserId !== id) {
      const follow = await prisma.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: id,
          },
        },
      });
      isFollowing = !!follow;
    }

    return NextResponse.json({
      ...user,
      isFollowing,
      followersCount: user._count.followedBy,
      followingCount: user._count.following,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 },
    );
  }
}
