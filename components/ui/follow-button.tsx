"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FollowButtonProps {
  userId: string;
  initialIsFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
  className?: string; // Add className prop
}

export function FollowButton({
  userId,
  initialIsFollowing = false,
  onFollowChange,
  className,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleFollow = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      if (isFollowing) {
        const res = await fetch(`/api/user/${userId}/follow`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to unfollow");
        setIsFollowing(false);
        onFollowChange?.(false);
        toast.success("Unfollowed");
      } else {
        const res = await fetch(`/api/user/${userId}/follow`, {
          method: "POST",
        });
        if (!res.ok) throw new Error("Failed to follow");
        setIsFollowing(true);
        onFollowChange?.(true);
        toast.success("Followed");
      }
      router.refresh();
    } catch (_error) {
      toast.error("Process failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isFollowing ? "secondary" : "outline"}
      size="sm" // Changed size to match original sidebar button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleFollow();
      }}
      disabled={isLoading}
      className={className} // Pass className through
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        "Following"
      ) : (
        "Follow"
      )}
    </Button>
  );
}
