import { Button } from "@/components/ui/button";
import { IQBadge } from "@/components/ui/iq-badge";
import { Post } from "@/types";
import { formatDate, truncateContent } from "@/lib/dummy-data";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PostCardProps {
  post: Post;
  isPreview?: boolean;
}

export function PostCard({ post, isPreview = true }: PostCardProps) {
  const displayContent = isPreview
    ? truncateContent(post.content, 420)
    : post.content;

  const postUrl = `/post/${post.id}`;

  return (
    <article className="relative group">
      <Link
        href={postUrl}
        className="absolute inset-0 z-10"
        aria-label={`Read post: ${post.title}`}
      >
        <div className="relative z-20 bg-card border border-border rounded-xl p-6 hover:shadow-card transition-all duration-300">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-lg font-bold">
                {post.author.displayName[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold hover:text-primary transition-colors">
                    {post.author.displayName}
                  </h3>
                  <IQBadge iq={post.author.iq} size="sm" />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>@{post.author.username}</span>
                  <span>•</span>
                  <span>{formatDate(post.publishedAt)}</span>
                  <Clock className="h-3 w-3 ml-1" />
                  <span>{post.readTime}m read</span>
                </div>
              </div>
            </div>
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
                  post.isLiked
                    ? "text-destructive hover:text-destructive"
                    : "hover:text-destructive"
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <Heart
                  className={cn("h-4 w-4", post.isLiked && "fill-current")}
                />
                <span>{post.likesCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle className="h-4 w-4" />
                <span>{post.commentsCount}</span>
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
      </Link>
    </article>
  );
}
