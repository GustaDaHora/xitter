"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MessageCircle, Loader2 } from "lucide-react";

interface EnrichedNotification {
  id: string;
  type: "LIKE" | "COMMENT";
  actor: {
    id: string;
    name: string;
    image: string | null;
  };
  post: {
    id: string;
    title: string;
  };
  timestamp: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<EnrichedNotification[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const NotificationIcon = ({ type }: { type: "LIKE" | "COMMENT" }) => {
    if (type === "LIKE") {
      return <Heart className="h-6 w-6 text-red-500 fill-current" />;
    }
    return <MessageCircle className="h-6 w-6 text-blue-500 fill-current" />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <Link
              href={`/post/${n.post.id}`}
              key={n.id}
              className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted transition-colors"
            >
              <div className="flex-shrink-0">
                <NotificationIcon type={n.type} />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <Image
                    src={n.actor.image || "/favicon.png"}
                    alt={`${n.actor.name}'s avatar`}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <p className="font-semibold">{n.actor.name}</p>
                </div>
                <p className="text-muted-foreground">
                  {n.type === "LIKE"
                    ? "liked your post: "
                    : "commented on your post: "}
                  <span className="font-medium text-foreground">
                    {n.post.title}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(n.timestamp).toLocaleString()}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              You have no notifications yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
