"use client";

import { IQBadge } from "@/components/ui/iq-badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { User } from "@/types";
import { Trophy, Medal, Award, Brain, Zap, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-6 w-6 text-yellow-500" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />;
    case 3:
      return <Award className="h-6 w-6 text-orange-500" />;
    default:
      return (
        <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
      );
  }
};

export default function Leaderboard() {
  const [leaderboardUsers, setLeaderboardUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setLeaderboardUsers(data.leaderboard);
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

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div>Loading leaderboard...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold bg-gradient-iq bg-clip-text text-transparent">
                IQ Leaderboard
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the brightest minds in our community. Take the IQ test to
              see where you rank among the intellectual elite.
            </p>
            <Link href="/iq-test">
              <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                <Zap className="h-4 w-4 mr-2" />
                Take IQ Test
              </Button>
            </Link>
          </div>

          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {leaderboardUsers.slice(0, 3).map((user, index) => {
              const rank = index + 1;
              const isFirst = rank === 1;

              return (
                <div
                  key={user.id}
                  className={cn(
                    "bg-gradient-card border border-border rounded-xl p-6 text-center space-y-4 transition-all duration-300 hover:shadow-elegant",
                    isFirst && "md:order-2 scale-105 ring-2 ring-primary/50",
                  )}
                >
                  <div className="flex justify-center">{getRankIcon(rank)}</div>

                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-bold">
                    {user.name ? user.name[0] : "U"}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-lg">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      @{user.username || user.email}
                    </p>
                    {user.iqScore && <IQBadge iq={user.iqScore} showCategory />}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {/* {user.followersCount.toLocaleString()} followers */}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Leaderboard */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Complete Rankings
              </h2>
            </div>

            <div className="divide-y divide-border">
              {leaderboardUsers.map((user, index) => {
                const rank = index + 1;
                const isTop3 = rank <= 3;

                return (
                  <div
                    key={user.id}
                    className={cn(
                      "p-6 hover:bg-muted/50 transition-colors",
                      isTop3 && "bg-primary/5",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 flex justify-center">
                          {isTop3 ? (
                            getRankIcon(rank)
                          ) : (
                            <span className="text-lg font-bold text-muted-foreground">
                              #{rank}
                            </span>
                          )}
                        </div>

                        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-lg font-bold">
                          {user.name ? user.name[0] : "U"}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{user.name}</h3>
                            {isTop3 && (
                              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                TOP 3
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            @{user.username || user.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          {user.iqScore && (
                            <IQBadge iq={user.iqScore} showCategory />
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {/* {user.followersCount.toLocaleString()} followers */}
                          </p>
                        </div>

                        <Button variant="outline" size="sm">
                          Follow
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* IQ Test CTA */}
          <div className="bg-gradient-primary rounded-xl p-8 text-center text-primary-foreground">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Test Your Intelligence?
            </h3>
            <p className="mb-6 opacity-90">
              Join thousands of users who have discovered their true
              intellectual potential. Our comprehensive IQ test takes just 30
              minutes.
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
            >
              <Brain className="h-5 w-5 mr-2" />
              Start IQ Test Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
