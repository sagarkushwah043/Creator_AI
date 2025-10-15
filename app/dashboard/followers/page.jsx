"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserPlus, UserMinus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { toast } from "sonner";

// ✅ User Card
const UserCard = ({ user, isLoading = false, variant = "follower", onToggle }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-700 rounded-xl hover:bg-slate-800/70 transition-all">
      {/* Avatar + Info */}
      <div className="flex items-center gap-3">
        <Link href={`/${user.username}`}>
          <div className="relative w-11 h-11 cursor-pointer">
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.name}
                fill
                className="rounded-full object-cover"
                sizes="44px"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </Link>
        <div>
          <Link href={user.username ? `/${user.username}` : ""}>
            <p className="font-medium text-white hover:text-purple-300 transition-colors">
              {user.name}
            </p>
            {user.username && (
              <p className="text-sm text-slate-400">@{user.username}</p>
            )}
          </Link>
        </div>
      </div>

      {/* Action Button */}
      {variant === "follower" ? (
        !user.followsBack && (
          <Button
            onClick={() => onToggle(user._id)}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition-all"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-1" />
                Follow Back
              </>
            )}
          </Button>
        )
      ) : (
        <Button
          onClick={() => onToggle(user._id)}
          disabled={isLoading}
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-red-400 transition-all"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <UserMinus className="h-4 w-4 mr-1" />
              Unfollow
            </>
          )}
        </Button>
      )}
    </div>
  );
};

// ✅ Main Page
const FollowersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: followers, isLoading: followersLoading } = useConvexQuery(
    api.followers.getMyFollowers,
    { limit: 100 }
  );
  const { data: following, isLoading: followingLoading } = useConvexQuery(
    api.followers.getMyFollowing,
    { limit: 100 }
  );

  const { mutate: toggleFollow, isLoading: isToggling } = useConvexMutation(
    api.followers.toggleFollow
  );

  const handleFollowToggle = async (userId) => {
    try {
      await toggleFollow({ followingId: userId });
    } catch (error) {
      toast.error(error.message || "Failed to update follow status");
    }
  };

  const filterUsers = (users) => {
    if (!searchQuery.trim()) return users || [];
    return (users || []).filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredFollowers = filterUsers(followers);
  const filteredFollowing = filterUsers(following);
  const isLoading = followersLoading || followingLoading;

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Followers & Following</h1>
        <p className="text-slate-400 mt-1 text-sm">
          Manage your connections and discover other creators
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-300" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="pl-10 bg-slate-800/60 border-slate-700 text-slate-100 placeholder:text-slate-400 
          focus:border-white focus:ring-1 focus:ring-white focus:text-white transition-all"
        />
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="followers">
        <TabsList className="grid grid-cols-2 w-full bg-slate-900/70 border border-slate-700 rounded-lg">
          <TabsTrigger
            value="followers"
            className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-800 
            hover:text-white hover:bg-slate-800 transition-all"
          >
            Followers ({filteredFollowers.length})
          </TabsTrigger>
          <TabsTrigger
            value="following"
            className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-800 
            hover:text-white hover:bg-slate-800 transition-all"
          >
            Following ({filteredFollowing.length})
          </TabsTrigger>
        </TabsList>

        {/* Followers Tab */}
        <TabsContent value="followers" className="mt-6 space-y-3">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-6 w-6 text-purple-400 animate-spin" />
            </div>
          ) : filteredFollowers.length > 0 ? (
            filteredFollowers.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                variant="follower"
                isLoading={isToggling}
                onToggle={handleFollowToggle}
              />
            ))
          ) : (
            <p className="text-center text-slate-400 text-sm py-8">
              No followers found.
            </p>
          )}
        </TabsContent>

        {/* Following Tab */}
        <TabsContent value="following" className="mt-6 space-y-3">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-6 w-6 text-purple-400 animate-spin" />
            </div>
          ) : filteredFollowing.length > 0 ? (
            filteredFollowing.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                variant="following"
                isLoading={isToggling}
                onToggle={handleFollowToggle}
              />
            ))
          ) : (
            <p className="text-center text-slate-400 text-sm py-8">
              You’re not following anyone yet.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FollowersPage;
