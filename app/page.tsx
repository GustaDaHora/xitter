"use client";
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { PostCard } from "@/components/feed/post-card";
import { SortControls } from "@/components/feed/sort-controls";
import { dummyPosts } from "@/lib/dummy-data";
import { SortOption } from "@/types";

export default function Home() {
  const [sortOption, setSortOption] = useState<SortOption>("recent");

  const sortedPosts = [...dummyPosts].sort((a, b) => {
    switch (sortOption) {
      case "highest-iq":
        return b.author.iq - a.author.iq;
      case "lowest-iq":
        return a.author.iq - b.author.iq;
      case "recent":
      default:
        return b.publishedAt.getTime() - a.publishedAt.getTime();
    }
  });

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

            <div className="space-y-6">
              {sortedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
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
