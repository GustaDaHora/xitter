"use client";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { PostCard } from "@/components/feed/post-card";
import { Button } from "@/components/ui/button";
import { dummyPosts } from "@/lib/dummy-data";
import { TrendingUp, Flame, Zap, Star } from "lucide-react";

export default function Trending() {
  // Sort by engagement (likes + comments)
  const trendingPosts = [...dummyPosts].sort((a, b) => {
    const aEngagement = a.likesCount + a.commentsCount;
    const bEngagement = b.likesCount + b.commentsCount;
    return bEngagement - aEngagement;
  });

  const trendingTopics = [
    { name: "#QuantumThinking", posts: 2847, trend: "+45%" },
    { name: "#AIPhilosophy", posts: 1923, trend: "+32%" },
    { name: "#NeuralNetworks", posts: 1456, trend: "+28%" },
    { name: "#CosmicPerspective", posts: 1203, trend: "+15%" },
    { name: "#DataScience", posts: 987, trend: "+22%" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />

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
                  <PostCard post={post} />
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
