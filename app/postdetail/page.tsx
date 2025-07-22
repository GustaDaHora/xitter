"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { PostCard } from "@/components/feed/post-card";
import { IQBadge } from "@/components/ui/iq-badge";
import { Button } from "@/components/ui/button";
import {
  dummyPosts,
  dummyComments,
  formatDate,
  currentUser,
} from "@/lib/dummy-data";
import { Heart, MessageCircle, Send, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function PostDetail() {
  const { id } = useParams();
  const [newComment, setNewComment] = useState("");

  const post = dummyPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <Link href="/" className="text-primary hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      // In a real app, this would submit to an API
      console.log("New comment:", newComment);
      setNewComment("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Button */}
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Feed
            </Link>
          </Button>

          {/* Post */}
          <PostCard post={post} isPreview={false} />

          {/* Comments Section */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-bold">
              Comments ({dummyComments.length})
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold">
                  {currentUser.displayName[0]}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full p-3 bg-muted border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    rows={3}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <IQBadge iq={currentUser.iq} size="sm" />
                      <span className="text-sm text-muted-foreground">
                        @{currentUser.username}
                      </span>
                    </div>
                    <Button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {dummyComments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold">
                    {comment.author.displayName[0]}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {comment.author.displayName}
                      </span>
                      <IQBadge iq={comment.author.iq} size="sm" />
                      <span className="text-sm text-muted-foreground">
                        @{comment.author.username}
                      </span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(comment.publishedAt)}
                      </span>
                    </div>

                    <p className="text-foreground/90">{comment.content}</p>

                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "gap-2 text-sm transition-all duration-200",
                          comment.isLiked
                            ? "text-destructive"
                            : "hover:text-destructive"
                        )}
                      >
                        <Heart
                          className={cn(
                            "h-4 w-4",
                            comment.isLiked && "fill-current"
                          )}
                        />
                        <span>{comment.likesCount}</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-sm hover:text-primary transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
