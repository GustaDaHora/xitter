"use client";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { PostCard } from "@/components/feed/post-card";
import { SortControls } from "@/components/feed/sort-controls";
import { Post, SortOption } from "@/types";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Following() {
  const { data: session } = useSession();
  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const [followingPosts, setFollowingPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowingPosts = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Assuming you have an API endpoint for fetching posts from followed users
        // For now, we'll fetch all posts and filter them (this is not efficient for large datasets)
        // A proper backend implementation would filter at the database level.
        const res = await fetch(`/api/posts?sortBy=${sortOption}`);
        const data = await res.json();
        // In a real app, you'd filter by followed users here or have a dedicated API
        setFollowingPosts(data.posts);
      } catch (error) {
        console.error("Failed to fetch following posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowingPosts();
  }, [sortOption, session]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!session) {
    return <div>Please sign in to view posts from followed users.</div>;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header toggleMenu={toggleMenu} />
      <div className="flex">
        <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

        <main className="flex-1 min-h-screen border-r border-border">
          <div className="max-w-2xl mx-auto p-6 space-y-6">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">Following</h1>
              <p className="text-muted-foreground">
                Posts from brilliant minds you follow
              </p>
              <SortControls
                currentSort={sortOption}
                onSortChange={setSortOption}
              />
            </div>

            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-12 bg-card border border-border rounded-xl">
                  <p className="text-muted-foreground">Loading posts...</p>
                </div>
              ) : followingPosts.length > 0 ? (
                followingPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLikeToggle={(postId, isLiked) => {
                      setFollowingPosts((prevPosts) =>
                        prevPosts.map((p) =>
                          p.id === postId
                            ? {
                                ...p,
                                likesCount: isLiked
                                  ? p.likesCount + 1
                                  : p.likesCount - 1,
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
                    No posts from followed users yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 h-screen sticky top-16 bg-card p-6">
          <div className="bg-gradient-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Following Activity</h3>
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">• 42 new posts today</p>
              <p className="text-muted-foreground">• 3 IQ tests completed</p>
              <p className="text-muted-foreground">
                • 18 genius insights shared
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
