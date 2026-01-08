"use client";

import { Button } from "@/components/ui/button";
import { IQBadge } from "@/components/ui/iq-badge";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User } from "@/types";
import {
  Home,
  Trophy,
  Users,
  TrendingUp,
  Bookmark,
  Plus,
  X,
  Newspaper,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Following", href: "/following", icon: Users },
  { name: "Trending", href: "/trending", icon: TrendingUp },
  { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { name: "What's new?", href: "/whats-new", icon: Newspaper },
];

export function Sidebar({
  isMenuOpen,
  toggleMenu,
}: {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [userPostsCount, setUserPostsCount] = useState<number>(0);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await fetch("/api/leaderboard?limit=3");
        const data = await res.json();
        setSuggestedUsers(data.leaderboard || []);
      } catch (error) {
        console.error("Failed to fetch suggested users:", error);
      }
    };

    const fetchUserPostsCount = async () => {
      if (session?.user?.id) {
        try {
          const res = await fetch(`/api/user/${session.user.id}`);
          const data = await res.json();
          if (data.posts != undefined) {
            setUserPostsCount(data.posts.length);
          }
        } catch (error) {
          console.error("Failed to fetch user posts count:", error);
        }
      }
    };

    fetchSuggestedUsers();
    fetchUserPostsCount();
  }, [session]);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 h-full w-72 transform border-r border-border bg-card p-4 transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isMenuOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="flex items-center justify-between md:hidden">
        <h2 className="text-lg font-semibold">Menu</h2>
        <Button variant="ghost" size="icon" onClick={toggleMenu}>
          <X className="h-6 w-6" />
        </Button>
      </div>
      <nav className="mt-8 space-y-2 md:mt-0">
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
                "bg-primary/10 text-primary border border-primary/20",
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
      <Button className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 h-12 mt-4">
        <Plus className="h-5 w-5 mr-2" />
        Compose
      </Button>

      {/* Suggested Users */}
      <div className="mt-4 bg-muted/50 rounded-xl p-4 space-y-4">
        <h3 className="font-semibold text-lg">Who to follow</h3>
        <div className="space-y-3">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold">
                  {user.name ? user.name[0] : "U"}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center justify-baseline gap-7 mb-1">
                    <p className="font-medium truncate">{user.name}</p>
                    <Button size="thin" variant="outline">
                      Follow
                    </Button>
                  </div>
                  <div className="flex items-center justify-baseline gap-13">
                    <span className="text-sm text-muted-foreground">
                      @{user.username || user.email}
                    </span>
                    {user.iqScore && <IQBadge iq={user.iqScore} size="sm" />}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 bg-gradient-card rounded-xl p-4 space-y-2">
        <h3 className="font-semibold">Your Stats</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{userPostsCount}</p>
            <p className="text-sm text-muted-foreground">Posts</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-success">
              {session?.user?.iqScore || "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">IQ Score</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
