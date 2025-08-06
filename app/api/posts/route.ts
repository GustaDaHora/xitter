import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";
import redis from "@/lib/redis";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const limit = parseInt(searchParams.get("limit") || "10");
  const sortBy = searchParams.get("sortBy") || "recent"; // 'recent', 'highestIQ', 'lowestIQ'

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const cacheKey = `posts:${sortBy}:${limit}:${cursor || ""}`;

  try {
    const cachedPosts = await redis.get(cacheKey);
    if (cachedPosts) {
      console.log(cachedPosts);
      return NextResponse.json(JSON.parse(cachedPosts));
    }
  } catch (error) {
    console.error("Redis error:", error);
  }

  type OrderBy = {
    createdAt?: "desc";
    author?: {
      iqScore: "desc" | "asc";
    };
  };

  let orderBy: OrderBy = { createdAt: "desc" };
  if (sortBy === "highestIQ") {
    orderBy = { author: { iqScore: "desc" } };
  } else if (sortBy === "lowestIQ") {
    orderBy = { author: { iqScore: "asc" } };
  }

  try {
    const posts = await prisma.post.findMany({
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor } }),
      orderBy,
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
        comments: {
          select: { id: true },
        },
        likes: {
          where: {
            userId: userId || "",
          },
          select: {
            userId: true,
          },
        },
      },
    });

    const postsWithLikeStatus = posts.map((post) => ({
      ...post,
      isLikedByCurrentUser: post.likes.length > 0,
    }));

    const hasNextPage = posts.length > limit;
    const nextCursor = hasNextPage ? posts[limit].id : null;

    const response = {
      posts: postsWithLikeStatus.slice(0, limit),
      hasNextPage,
      nextCursor,
    };

    try {
      await redis.set(cacheKey, JSON.stringify(response), "EX", 60 * 5); // Cache for 5 minutes
    } catch (error) {
      console.error("Redis error:", error);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, content } = await req.json();
  const authorId = session.user.id;

  if (!title || !content) {
    return NextResponse.json(
      { error: "Title and content are required" },
      { status: 400 },
    );
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });

    try {
      const keys = await redis.keys("posts:recent:*");
      if (keys.length > 0) {
        await redis.del(keys);
      }
    } catch (error) {
      console.error("Redis error:", error);
    }

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
