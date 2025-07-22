"use client";
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { PostCard } from "@/components/feed/post-card";
import { IQBadge } from "@/components/ui/iq-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { currentUser, dummyPosts } from "@/lib/dummy-data";
import {
  Calendar,
  MapPin,
  Link as LinkIcon,
  Edit3,
  Save,
  X,
  Settings,
} from "lucide-react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: currentUser.displayName,
    bio: currentUser.bio,
    email: currentUser.email,
  });

  const userPosts = dummyPosts.filter(
    (post) => post.author.id === currentUser.id
  );

  const handleSave = () => {
    // In a real app, this would update the user profile via API
    console.log("Updated profile:", editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      displayName: currentUser.displayName,
      bio: currentUser.bio,
      email: currentUser.email,
    });
    setIsEditing(false);
  };

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
                    {currentUser.displayName[0]}
                  </div>

                  {/* Basic Info */}
                  <div className="space-y-2">
                    {isEditing ? (
                      <Input
                        value={editForm.displayName}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            displayName: e.target.value,
                          })
                        }
                        className="text-2xl font-bold bg-transparent border-none p-0 h-auto"
                      />
                    ) : (
                      <h1 className="text-2xl font-bold">
                        {currentUser.displayName}
                      </h1>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        @{currentUser.username}
                      </span>
                      <IQBadge iq={currentUser.iq} showCategory />
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mt-4 space-y-4">
                {isEditing ? (
                  <Textarea
                    value={editForm.bio}
                    onChange={(e) =>
                      setEditForm({ ...editForm, bio: e.target.value })
                    }
                    placeholder="Tell us about yourself..."
                    className="resize-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-foreground/90">{currentUser.bio}</p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined{" "}
                      {currentUser.joinedAt.toLocaleDateString("en-US", {
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
                    <span className="font-bold">
                      {currentUser.followingCount}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      Following
                    </span>
                  </div>
                  <div>
                    <span className="font-bold">
                      {currentUser.followersCount}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      Followers
                    </span>
                  </div>
                  <div>
                    <span className="font-bold">{userPosts.length}</span>
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
              {userPosts.length > 0 ? (
                userPosts.map((post) => <PostCard key={post.id} post={post} />)
              ) : (
                <div className="text-center py-12 bg-card border border-border rounded-xl">
                  <p className="text-muted-foreground">
                    No posts yet. Start sharing your genius!
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <h3 className="text-2xl font-bold text-primary">
                    {currentUser.iq}
                  </h3>
                  <p className="text-muted-foreground">Current IQ Score</p>
                  <Button className="mt-4" size="sm">
                    Retake Test
                  </Button>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <h3 className="text-2xl font-bold text-success">Top 11%</h3>
                  <p className="text-muted-foreground">Global Ranking</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <h3 className="text-2xl font-bold text-warning">42</h3>
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
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 p-3 bg-muted rounded-lg">
                        {currentUser.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium">Username</label>
                    <p className="mt-1 p-3 bg-muted rounded-lg">
                      @{currentUser.username}
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
