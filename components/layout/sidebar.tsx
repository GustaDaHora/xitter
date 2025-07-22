"use client";

import { Button } from "@/components/ui/button";
import { IQBadge } from "@/components/ui/iq-badge";
import { dummyUsers } from "@/lib/dummy-data";
import { Home, Trophy, Users, TrendingUp, Bookmark, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Following", href: "/following", icon: Users },
  { name: "Trending", href: "/trending", icon: TrendingUp },
  { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
];

export function Sidebar() {
  const pathname = usePathname();
  const suggestedUsers = dummyUsers.slice(1, 4); // Top 3 users to follow

  return (
    <aside className="w-74 h-screen sticky top-16 bg-card border-r border-border p-4 space-y-6">
      {/* Navigation */}
      <nav className="space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.name}
              asChild
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-12",
                isActive &&
                  "bg-primary/10 text-primary border border-primary/20"
              )}
            >
              <Link href={item.href}>
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            </Button>
          );
        })}
      </nav>

      {/* Compose Button */}
      <Button className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 h-12">
        <Plus className="h-5 w-5 mr-2" />
        Compose
      </Button>

      {/* Suggested Users */}
      <div className="bg-muted/50 rounded-xl p-4 space-y-4">
        <h3 className="font-semibold text-lg">Who to follow</h3>
        <div className="space-y-3">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold">
                  {user.displayName[0]}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium truncate">{user.displayName}</p>
                    <Button size="thin" variant="outline">
                      Follow
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      @{user.username}
                    </span>
                    <IQBadge iq={user.iq} size="sm" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-card rounded-xl p-4 space-y-2">
        <h3 className="font-semibold">Your Stats</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">1,247</p>
            <p className="text-sm text-muted-foreground">Posts</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-success">89%</p>
            <p className="text-sm text-muted-foreground">IQ Rank</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
