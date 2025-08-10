import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import redis from "@/lib/redis";
import prisma from "@/lib/prisma";

type RedisStreamEntry = [string, string[]];

function parseStreamData(data: RedisStreamEntry[]) {
  return data.map(([id, fields]) => {
    const obj: { [key: string]: string } = { id };
    for (let i = 0; i < fields.length; i += 2) {
      obj[fields[i]] = fields[i + 1];
    }
    return obj;
  });
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const streamKey = `notifications:${userId}`;

  try {
    const rawNotifications = await redis.xrevrange(
      streamKey,
      "+",
      "-",
      "COUNT",
      50,
    );
    if (!rawNotifications.length) {
      return NextResponse.json([]);
    }

    const notifications = parseStreamData(rawNotifications);

    const actorIds = [...new Set(notifications.map((n) => n.actorId))];
    const postIds = [...new Set(notifications.map((n) => n.postId))];

    const [actors, posts] = await Promise.all([
      prisma.user.findMany({
        where: { id: { in: actorIds } },
        select: { id: true, name: true, image: true },
      }),
      prisma.post.findMany({
        where: { id: { in: postIds } },
        select: { id: true, title: true },
      }),
    ]);

    const actorsMap = new Map(actors.map((a) => [a.id, a]));
    const postsMap = new Map(posts.map((p) => [p.id, p]));

    const enrichedNotifications = notifications.map((n) => ({
      ...n,
      actor: actorsMap.get(n.actorId),
      post: postsMap.get(n.postId),
    }));

    return NextResponse.json(enrichedNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}
