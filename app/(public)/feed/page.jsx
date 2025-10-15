"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { TrendingUp, UserPlus, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import PostCard from "@/components/post-card";

export default function FeedPage() {
  const { user: currentUser } = useUser();
  const [activeTab, setActiveTab] = useState("feed");

  const { ref: loadMoreRef } = useInView({ threshold: 0, rootMargin: "100px" });

  const { data: feedData, isLoading: feedLoading } = useConvexQuery(api.feed.getFeed, { limit: 15 });
  const { data: trendingPosts, isLoading: trendingLoading } = useConvexQuery(api.feed.getTrendingPosts, { limit: 15 });
  const { data: suggestedUsers, isLoading: suggestionsLoading } = useConvexQuery(api.feed.getSuggestedUsers, { limit: 6 });

  const toggleFollow = useConvexMutation(api.follows.toggleFollow);

  const handleFollowToggle = async (userId) => {
    if (!currentUser) {
      toast.error("Please sign in to follow users");
      return;
    }

    try {
      await toggleFollow.mutate({ followingId: userId });
      toast.success("Follow status updated");
    } catch (error) {
      toast.error(error.message || "Failed to update follow status");
    }
  };

  const getCurrentPosts = () => (activeTab === "trending" ? trendingPosts || [] : feedData?.posts || []);
  const isLoading = feedLoading || (activeTab === "trending" && trendingLoading);
  const currentPosts = getCurrentPosts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-black text-white pt-32 pb-10 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent">
            Discover Amazing Content
          </h1>
          <p className="text-slate-400 mt-2">Stay updated with the latest posts from creators you love</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* Feed Section */}
          <div className="lg:col-span-4 space-y-6">
            {/* Filter Tabs */}
            <div className="flex space-x-2 bg-slate-800/40 p-1 rounded-xl backdrop-blur-md border border-slate-700/50">
              <Button
                onClick={() => setActiveTab("feed")}
                className={`flex-1 rounded-lg transition-all duration-300 ${
                  activeTab === "feed"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                    : "bg-transparent text-slate-400 hover:text-white"
                }`}
              >
                For You
              </Button>
              <Button
                onClick={() => setActiveTab("trending")}
                className={`flex-1 rounded-lg transition-all duration-300 flex items-center justify-center ${
                  activeTab === "trending"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                    : "bg-transparent text-slate-400 hover:text-white"
                }`}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending
              </Button>
            </div>

            {/* Create Post Box */}
            {currentUser && (
              <Link href="/dashboard/create" className="flex items-center space-x-3 cursor-pointer">
                <div className="relative w-10 h-10">
                  {currentUser.imageUrl ? (
                    <Image
                      src={currentUser.imageUrl}
                      alt={currentUser.firstName || "User"}
                      fill
                      className="rounded-full object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm font-bold">
                      {(currentUser.firstName || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="bg-slate-800/60 border border-slate-700 rounded-full px-4 py-3 text-slate-400 hover:border-slate-500 hover:bg-slate-800 transition">
                    What's on your mind? Share your thoughts...
                  </div>
                </div>
              </Link>
            )}

            {/* Posts Feed */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
              </div>
            ) : currentPosts.length === 0 ? (
              <Card className="bg-slate-800/40 border border-slate-700 text-center backdrop-blur-md">
                <CardContent className="py-12">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {activeTab === "trending" ? "No trending posts yet" : "No posts to show"}
                  </h3>
                  <p className="text-slate-400">
                    {activeTab === "trending"
                      ? "Check back later for trending content"
                      : "Follow creators to see their latest posts here"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-6">
                  {currentPosts.map((post) => (
                    <PostCard key={post._id} post={post} showActions={false} showAuthor={true} className="max-w-none" />
                  ))}
                </div>

                {activeTab === "feed" && feedData?.hasMore && (
                  <div ref={loadMoreRef} className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar - Suggested Users */}
          <div className="lg:col-span-2 space-y-6 mt-14">
            <Card className="bg-slate-800/40 border border-slate-700 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
                  Suggested Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                {suggestionsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                  </div>
                ) : !suggestedUsers || suggestedUsers.length === 0 ? (
                  <div className="text-center py-4 text-slate-400 text-sm">No suggestions available</div>
                ) : (
                  <div className="space-y-4">
                    {suggestedUsers.map((user) => (
                      <div key={user._id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Link href={`/${user.username}`}>
                            <div className="flex items-center space-x-3 cursor-pointer">
                              <div className="relative w-10 h-10">
                                {user.imageUrl ? (
                                  <Image
                                    src={user.imageUrl}
                                    alt={user.name}
                                    fill
                                    className="rounded-full object-cover"
                                    sizes="40px"
                                  />
                                ) : (
                                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">{user.name}</p>
                                <p className="text-xs text-slate-400">@{user.username}</p>
                              </div>
                            </div>
                          </Link>
                          <Button
                            onClick={() => handleFollowToggle(user._id)}
                            variant="outline"
                            size="sm"
                            className="border-purple-500 text-purple-400 hover:bg-purple-600 hover:text-white transition"
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            Follow
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
