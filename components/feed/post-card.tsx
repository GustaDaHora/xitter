"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Clock, Heart, MessageCircle, MoreHorizontal, Repeat2, Share } from "lucide-react";
import { IQBadge } from "../ui/iq-badge";
import { cn, formatDate, calculateReadTime } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  isPreview?: boolean;
  onLikeToggle?: (postId: string, isLiked: boolean) => void;
}

const truncateContent = (text: string | undefined | null, maxLength: number) => {
  if (!text) return "";
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
};

export function PostCard({
  post,
  isPreview = true,
  onLikeToggle,
}: PostCardProps) {
  const { data: session } = useSession();
  const [currentLikes, setCurrentLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(post.isLikedByCurrentUser || false);

  useEffect(() => {
    setCurrentLikes(post.likes);
    setIsLiked(post.isLikedByCurrentUser || false);
  }, [post.likes, post.isLikedByCurrentUser]);

  const handleLike = async () => {
    if (!session) {
      alert("You need to be logged in to like a post.");
      return;
    }

    try {
      const method = isLiked ? "DELETE" : "POST";
      const res = await fetch(`/api/posts/${post.id}/like`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setIsLiked(!isLiked);
        setCurrentLikes(isLiked ? currentLikes - 1 : currentLikes + 1);
        if (onLikeToggle) {
          onLikeToggle(post.id, !isLiked);
        }
      } else {
        const errorData = await res.json();
        alert(`Failed to toggle like: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      alert("An unexpected error occurred while toggling like.");
    }
  };

  const displayContent = isPreview
    ? truncateContent(post.content, 420)
    : post.content;

  const postUrl = `/postdetail/${post.id}`;

  return (
    <article
      className="relative group bg-card border border-border rounded-xl p-6 hover:shadow-card transition-all duration-300"
    >
      {/* Clickable area for the entire card */}
      <Link href={postUrl} className="absolute inset-0 z-10" aria-label={`Read post: ${post.title}`} />

      <div className="relative z-20">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <Link
            href={`/profile/${post.author.id}`}
            className="flex items-center gap-3 z-30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-lg font-bold">
              {post.author.name ? post.author.name[0] : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold hover:text-primary transition-colors">
                  {post.author.name}
                </h3>
                {post.author.iqScore && (
                  <IQBadge iq={post.author.iqScore} size="sm" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>@{post.author.username || post.author.email}</span>
                <span>•</span>
                <span>{formatDate(post.createdAt)}</span>
                <Clock className="h-3 w-3 ml-1" />
                <span>{calculateReadTime(post.content)}m read</span>
              </div>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity z-30"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h2
            className={cn(
              "text-xl font-bold leading-tight",
              isPreview && "hover:text-primary transition-colors"
            )}
          >
            {truncateContent(post.title, 69)}
          </h2>

          <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
            {displayContent}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border z-30 relative">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-2 transition-all duration-200",
                isLiked
                  ? "text-destructive hover:text-destructive"
                  : "hover:text-destructive"
              )}
              onClick={handleLike}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
              <span>{currentLikes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2 hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments?.length || 0}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2 hover:text-success transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Repeat2 className="h-4 w-4" />
              <span>42</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="hover:text-primary transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
