"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { PostCard } from "@/components/feed/post-card";
import { SortControls } from "@/components/feed/sort-controls";
import { SortOption, Post } from "@/types";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session } = useSession();
  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/posts?sortBy=${sortOption}`);
        const data = await res.json();
        setPosts(data.posts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [sortOption]);

  const handleCreatePost = async () => {
    if (!session) {
      alert("You need to be logged in to create a post.");
      return;
    }
    if (!newPostTitle || !newPostContent) {
      alert("Title and content cannot be empty.");
      return;
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newPostTitle,
          content: newPostContent,
        }),
      });

      if (res.ok) {
        setNewPostTitle("");
        setNewPostContent("");
        // Re-fetch posts to show the new one
        const updatedRes = await fetch(`/api/posts?sortBy=${sortOption}`);
        const updatedData = await updatedRes.json();
        setPosts(updatedData.posts);
      } else {
        const errorData = await res.json();
        alert(`Failed to create post: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An unexpected error occurred while creating the post.");
    }
  };

  if (loading) {
    return <div>Loading posts...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />

        {/* Main Feed */}
        <main className="flex-1 min-h-screen border-r border-border">
          <div className="max-w-2xl mx-auto p-6 space-y-6">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">Your Feed</h1>
              <SortControls
                currentSort={sortOption}
                onSortChange={setSortOption}
              />
            </div>

            {session && (
              <div className="bg-gradient-card border border-border rounded-xl p-6 space-y-4">
                <h2 className="text-xl font-semibold">Create New Post</h2>
                <Input
                  placeholder="Post Title (max 69 chars)"
                  maxLength={69}
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />
                <Textarea
                  placeholder="What's on your mind? (max 420 chars)"
                  maxLength={420}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={4}
                />
                <Button onClick={handleCreatePost}>Post</Button>
              </div>
            )}

            <div className="space-y-6">
              {Array.isArray(posts) && posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLikeToggle={(postId, isLiked) => {
                      setPosts((prevPosts) =>
                        prevPosts.map((p) =>
                          p.id === postId
                            ? {
                                ...p,
                                likes: isLiked ? p.likes + 1 : p.likes - 1,
                                isLikedByCurrentUser: isLiked,
                              }
                            : p
                        )
                      );
                    }}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-card border border-border rounded-xl">
                  <p className="text-muted-foreground">
                    No posts yet. Be the first to share your genius!
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-70 h-screen sticky top-16 bg-card border-l border-border p-6 space-y-6">
          <div className="bg-gradient-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Trending IQ Topics</h3>
            <div className="space-y-3">
              {[
                { tag: "#QuantumThinking", posts: "2.4K posts" },
                { tag: "#AIPhilosophy", posts: "1.8K posts" },
                { tag: "#NeuralNetworks", posts: "1.2K posts" },
                { tag: "#CosmicPerspective", posts: "956 posts" },
              ].map((topic) => (
                <div
                  key={topic.tag}
                  className="p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <p className="font-medium text-primary">{topic.tag}</p>
                  <p className="text-sm text-muted-foreground">{topic.posts}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">IQ Insights</h3>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">142</p>
                <p className="text-sm text-muted-foreground">
                  Average IQ Today
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-success">↑12%</p>
                  <p className="text-xs text-muted-foreground">vs Yesterday</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-warning">89</p>
                  <p className="text-xs text-muted-foreground">
                    Active Geniuses
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
