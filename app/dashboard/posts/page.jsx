"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Search, Filter, FileText } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { toast } from "sonner";
import Link from "next/link";
import PostCard from "@/components/post-card";

export default function PostsPage() {
  const router = useRouter();
  const [userReady, setUserReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Store user on mount
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    storeUser()
      .then(() => setUserReady(true))
      .catch((err) => {
        console.error("Failed to store user:", err);
        setUserReady(true);
      });
  }, [storeUser]);

  // Fetch posts - only after user is ready
  const posts = useQuery(api.posts.getUserPosts, userReady ? {} : "skip");
  const deletePost = useConvexMutation(api.posts.deletePost);

  const isLoading = posts === undefined;

  const filteredPosts = React.useMemo(() => {
    if (!posts) return [];

    let filtered = posts.filter((post) => {
      const matchesSearch = post.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || post.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt - a.createdAt;
        case "oldest":
          return a.createdAt - b.createdAt;
        case "mostViews":
          return b.viewCount - a.viewCount;
        case "mostLikes":
          return b.likeCount - a.likeCount;
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return b.createdAt - a.createdAt;
      }
    });

    return filtered;
  }, [posts, searchQuery, statusFilter, sortBy]);

  const handleEditPost = (post) => {
    router.push(`/dashboard/posts/edit/${post._id}`);
  };

  const handleDeletePost = async (post) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await deletePost.mutate({ id: post._id });
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const handleDuplicatePost = (post) => {
    toast.info("Duplicate post feature coming soon!");
  };

  if (!userReady || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto" />
          <p className="text-slate-400 mt-4 text-sm">Loading your posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">My Posts</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Manage, filter, and track your published and draft posts
          </p>
        </div>

        <Link href="/dashboard/create">
          <Button variant="primary" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Filters & Search */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
              <Input
                placeholder="Search posts by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/60 border-slate-700 text-slate-100 placeholder:text-slate-400 
                focus:border-white focus:ring-1 focus:ring-white focus:text-white"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                className="w-full md:w-44 bg-slate-800/60 border-slate-700 text-slate-100 
                focus:border-white focus:ring-1 focus:ring-white hover:border-slate-500"
              >
                <Filter className="h-4 w-4 mr-2 text-slate-300" />
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 text-white border border-slate-700">
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger
                className="w-full md:w-44 bg-slate-800/60 border-slate-700 text-slate-100
                focus:border-white focus:ring-1 focus:ring-white hover:border-slate-500"
              >
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 text-white border border-slate-700">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="mostViews">Most Viewed</SelectItem>
                <SelectItem value="mostLikes">Most Liked</SelectItem>
                <SelectItem value="alphabetical">A–Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-1">
              {searchQuery || statusFilter !== "all"
                ? "No matching posts found"
                : "No posts yet"}
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              {searchQuery || statusFilter !== "all"
                ? "Try refining your search or adjusting filters."
                : "Start by creating your first post!"}
            </p>

            {!searchQuery && statusFilter === "all" && (
              <Link href="/dashboard/create">
                <Button variant="primary" className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Create Post
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              showActions
              showAuthor={false}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              onDuplicate={handleDuplicatePost}
            />
          ))}
        </div>
      )}
    </div>
  );
}