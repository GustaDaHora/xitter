import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const userId = session.user.id;

  try {
    // Check if the user has already liked the post
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: id,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { message: "Post already liked" },
        { status: 200 }
      );
    }

    // Use a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create the like
      await tx.like.create({
        data: {
          userId,
          postId: id,
        },
      });

      // Update the post's likesCount
      const updatedPost = await tx.post.update({
        where: { id },
        data: {
          likesCount: {
            increment: 1,
          },
        },
      });

      return updatedPost;
    });

    return NextResponse.json({
      message: "Post liked successfully",
      likes: result.likesCount,
    });
  } catch (error) {
    console.error("Error liking post:", error);
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const userId = session.user.id;

  try {
    // Check if the user has liked the post
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: id,
        },
      },
    });

    if (!existingLike) {
      return NextResponse.json({ message: "Post not liked" }, { status: 200 });
    }

    // Use a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Delete the like
      await tx.like.delete({
        where: {
          userId_postId: {
            userId,
            postId: id,
          },
        },
      });

      // Update the post's likesCount
      const updatedPost = await tx.post.update({
        where: { id },
        data: {
          likesCount: {
            decrement: 1,
          },
        },
      });

      return updatedPost;
    });

    return NextResponse.json({
      message: "Post unliked successfully",
      likes: result.likesCount,
    });
  } catch (error) {
    console.error("Error unliking post:", error);
    return NextResponse.json(
      { error: "Failed to unlike post" },
      { status: 500 }
    );
  }
}