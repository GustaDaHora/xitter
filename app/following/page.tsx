"use client";
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { PostCard } from '@/components/feed/post-card';
import { SortControls } from '@/components/feed/sort-controls';
import { dummyPosts } from '@/lib/dummy-data';
import { SortOption } from '@/types';
import { useState } from 'react';

export default function Following() {
  const [sortOption, setSortOption] = useState<SortOption>('recent');

  // Filter posts from followed users (for demo, showing all posts)
  const followingPosts = [...dummyPosts].sort((a, b) => {
    switch (sortOption) {
      case 'highest-iq':
        return b.author.iq - a.author.iq;
      case 'lowest-iq':
        return a.author.iq - b.author.iq;
      case 'recent':
      default:
        return b.publishedAt.getTime() - a.publishedAt.getTime();
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 min-h-screen border-r border-border">
          <div className="max-w-2xl mx-auto p-6 space-y-6">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">Following</h1>
              <p className="text-muted-foreground">
                Posts from brilliant minds you follow
              </p>
              <SortControls currentSort={sortOption} onSortChange={setSortOption} />
            </div>
            
            <div className="space-y-6">
              {followingPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
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
              <p className="text-muted-foreground">• 18 genius insights shared</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}