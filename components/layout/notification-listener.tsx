"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Notification } from "@prisma/client";

export default function NotificationListener() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on<Notification>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Notification",
          filter: `recipientId=eq.${userId}`,
        },
        async (payload) => {
          const notification = payload.new as Notification;

          const { data: actor } = await supabase
            .from("User")
            .select("name")
            .eq("id", notification.actorId)
            .single();

          const actorName = actor?.name || "Someone";

          const message =
            notification.type === "LIKE"
              ? `${actorName} liked your post.`
              : `${actorName} commented on your post.`;

          toast.success(message);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return null;
}
