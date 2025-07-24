'use client'

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { PostCard } from "@/components/feed/post-card";
import { IQBadge } from "@/components/ui/iq-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Post } from "@/types";
import {
  Calendar,
  MapPin,
  Link as LinkIcon,
  Settings,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  username?: string;
  image?: string;
  bio?: string;
  iqScore?: number;
  createdAt: string;
  posts: Post[];
}

export default function PublicProfilePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const [id, setId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolve params promise
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setId(resolvedParams.id);
      } catch (err) {
        setError("Failed to load profile parameters");
        setLoading(false);
      }
    };

    resolveParams();
  }, [params]);

  // Fetch user profile once id is available
  useEffect(() => {
    if (!id) return;

    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`/api/user/${id}`);
        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setUserProfile(data);
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

    fetchUserProfile();
  }, [id]);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userProfile) {
    return <div>Profile not found.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <div className="bg-gradient-card border border-border rounded-xl overflow-hidden">
            {/* Cover Image */}
            <div className="h-48 bg-gradient-primary relative">
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Profile Info */}
            <div className="p-6 relative">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-bold border-4 border-background -mt-12">
                    {userProfile.name ? userProfile.name[0] : "U"}
                  </div>

                  {/* Basic Info */}
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold">
                      {userProfile.name}
                    </h1>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        @{userProfile.username || "No username set yet"}
                      </span>
                      {userProfile.iqScore && (
                        <IQBadge iq={userProfile.iqScore} showCategory />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-4 space-y-4">
                <p className="text-foreground/90">{userProfile.bio || "No bio available."}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined{" "}
                      {new Date(userProfile.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>Digital Realm</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <LinkIcon className="h-4 w-4" />
                    <span className="text-primary">genius.ai</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-6">
                  <div>
                    <span className="font-bold">0</span>
                    <span className="text-muted-foreground ml-1">
                      Following
                    </span>
                  </div>
                  <div>
                    <span className="font-bold">0</span>
                    <span className="text-muted-foreground ml-1">
                      Followers
                    </span>
                  </div>
                  <div>
                    <span className="font-bold">{userProfile.posts.length}</span>
                    <span className="text-muted-foreground ml-1">Posts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Tabs */}
          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-6">
              {userProfile.posts.length > 0 ? (
                userProfile.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="text-center py-12 bg-card border border-border rounded-xl">
                  <p className="text-muted-foreground">
                    No posts yet.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <h3 className="text-2xl font-bold text-primary">
                    {userProfile.iqScore || "N/A"}
                  </h3>
                  <p className="text-muted-foreground">Current IQ Score</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <h3 className="text-2xl font-bold text-success">N/A</h3>
                  <p className="text-muted-foreground">Global Ranking</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <h3 className="text-2xl font-bold text-warning">N/A</h3>
                  <p className="text-muted-foreground">Avg. Likes/Post</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Settings
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="mt-1 p-3 bg-muted rounded-lg">
                      {userProfile.email}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Username</label>
                    <p className="mt-1 p-3 bg-muted rounded-lg">
                      @{userProfile.username || "No username set yet"}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Button variant="destructive" size="sm">
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}