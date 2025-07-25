"use client";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { PostCard } from "@/components/feed/post-card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Post } from "@/types";
import { TrendingUp, Flame, Zap, Star } from "lucide-react";

export default function Trending() {
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/posts"); // Fetch all posts
        const data = await res.json();
        const sorted = [...data.posts].sort((a: Post, b: Post) => {
          const aEngagement = a.likesCount + a.comments.length;
          const bEngagement = b.likesCount + b.comments.length;
          return bEngagement - aEngagement;
        });
        setTrendingPosts(sorted);
      } catch (error) {
        console.error("Failed to fetch trending posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingPosts();
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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

  return (
    <div className="min-h-screen bg-background">
      <Header toggleMenu={toggleMenu} />
      <div className="flex">
      <Sidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

        <main className="flex-1 min-h-screen border-r border-border">
          <div className="max-w-2xl mx-auto p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Flame className="h-6 w-6 text-orange-500" />
                <h1 className="text-2xl font-bold">Trending</h1>
              </div>
              <p className="text-muted-foreground">
                The most engaging posts from the intellectual community
              </p>
            </div>

            <div className="space-y-6">
              {trendingPosts.map((post, index) => (
                <div key={post.id} className="relative">
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2 bg-gradient-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <Flame className="h-3 w-3" />
                      HOT
                    </div>
                  )}
                  <PostCard
                    post={post}
                    onLikeToggle={(postId, isLiked) => {
                      setTrendingPosts((prevPosts) =>
                        prevPosts.map((p) =>
                          p.id === postId
                            ? {
                                ...p,
                                likes: isLiked
                                  ? p.likesCount + 1
                                  : p.likesCount - 1,
                                isLikedByCurrentUser: isLiked,
                              }
                            : p
                        )
                      );
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 h-screen sticky top-16 bg-card p-6 space-y-6">
          <div className="bg-gradient-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Trending Topics
            </h3>
            <div className="space-y-3">
              {trendingTopics.map((topic, index) => (
                <div
                  key={topic.name}
                  className="p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-primary">
                      {topic.name}
                    </span>
                    {index < 3 && <Star className="h-4 w-4 text-yellow-500" />}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
                    <span>{topic.posts.toLocaleString()} posts</span>
                    <span className="text-success">{topic.trend}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              See More Topics
            </Button>
          </div>

          <div className="bg-muted/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              IQ Trending
            </h3>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">156</p>
                <p className="text-sm text-muted-foreground">
                  Avg IQ in trending
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-success">↑8%</p>
                  <p className="text-xs text-muted-foreground">vs last week</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-warning">23</p>
                  <p className="text-xs text-muted-foreground">genius posts</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
