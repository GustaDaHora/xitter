"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PostCard } from "@/components/feed/post-card";
import { IQBadge } from "@/components/ui/iq-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Heart, MessageCircle, Send, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Post } from "@/types";

export default function PostDetail() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setPost(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, session]);

  // Handle post like toggle
  const handlePostLike = async () => {
    if (!session) {
      alert("You need to be logged in to like a post.");
      return;
    }

    if (!post) return;

    try {
      const method = post.isLikedByCurrentUser ? "DELETE" : "POST";
      const res = await fetch(`/api/posts/${post.id}/like`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setPost((prevPost) => {
          if (!prevPost) return null;
          return {
            ...prevPost,
            likesCount: data.likes, // Use the actual count from server response
            isLikedByCurrentUser: !prevPost.isLikedByCurrentUser,
          };
        });
      } else {
        const errorData = await res.json();
        alert(`Failed to toggle like: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error toggling post like:", error);
      alert("An unexpected error occurred while toggling like.");
    }
  };

  // Handle comment like toggle
  const handleCommentLike = async (commentId: string) => {
    if (!session) {
      alert("You need to be logged in to like a comment.");
      return;
    }

    if (!post) return;

    const comment = post.comments.find((c) => c.id === commentId);
    if (!comment) return;

    try {
      const method = comment.isLikedByCurrentUser ? "DELETE" : "POST";
      const res = await fetch(`/api/comments/${commentId}/like`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setPost((prevPost) => {
          if (!prevPost) return null;
          return {
            ...prevPost,
            comments: prevPost.comments.map((c) =>
              c.id === commentId
                ? {
                    ...c,
                    likesCount: data.likes, // Use actual count from server
                    isLikedByCurrentUser: !c.isLikedByCurrentUser,
                  }
                : c
            ),
          };
        });
      } else {
        const errorData = await res.json();
        alert(`Failed to toggle comment like: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error toggling comment like:", error);
      alert("An unexpected error occurred while toggling comment like.");
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert("You need to be logged in to comment.");
      return;
    }
    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const res = await fetch(`/api/posts/${post?.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (res.ok) {
        setNewComment("");
        // Re-fetch post to get the new comment
        const updatedRes = await fetch(`/api/posts/${post?.id}`);
        const updatedData = await updatedRes.json();
        setPost(updatedData);
      } else {
        const errorData = await res.json();
        alert(`Failed to add comment: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("An unexpected error occurred while adding the comment.");
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in-up p-6 bg-card text-card-foreground rounded-2xl shadow-lg max-w-md mx-auto mt-20">
        <h1 className="text-2xl font-bold mb-2">Hello, world!</h1>
        <p className="text-muted-foreground">
          This is a simple animated component using Tailwind CSS.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-destructive">Error</h1>
            <p className="mb-4">{error}</p>
            <Link href="/" className="text-primary hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
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

  return (
    <div className="min-h-screen bg-background">
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
          <PostCard
            post={post}
            isPreview={false}
            onLikeToggle={handlePostLike}
          />

          {/* Comments Section */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <h2 className="text-xl font-bold">
              Comments ({post.comments.length})
            </h2>

            {/* Comment Form */}
            {session ? (
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold">
                    {session?.user?.name ? session.user.name[0] : "U"}
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
                        {session?.user?.iqScore && (
                          <IQBadge iq={session.user.iqScore} size="sm" />
                        )}
                        <span className="text-sm text-muted-foreground">
                          @{session?.user?.username}
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
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>{" "}
                to leave a comment
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold">
                      {comment.author.name ? comment.author.name[0] : "U"}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {comment.author.name}
                        </span>
                        {comment.author.iqScore && (
                          <IQBadge iq={comment.author.iqScore} size="sm" />
                        )}
                        <span className="text-sm text-muted-foreground">
                          @{comment.author.username}
                        </span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>

                      <p className="text-foreground/90">{comment.content}</p>

                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCommentLike(comment.id)}
                          className={cn(
                            "gap-2 text-sm transition-all duration-200",
                            comment.isLikedByCurrentUser
                              ? "text-destructive"
                              : "hover:text-destructive"
                          )}
                        >
                          <Heart
                            className={cn(
                              "h-4 w-4",
                              comment.isLikedByCurrentUser && "fill-current"
                            )}
                          />
                          <span>{comment.likesCount || 0}</span>
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
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No comments yet. Be the first to share your thoughts!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
