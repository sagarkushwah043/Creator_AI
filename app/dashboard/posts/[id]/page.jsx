"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import PostEditor from "@/components/post-editor";

export default function EditPostPage() {
  const params = useParams();
  const postId = params.id;
  const [userReady, setUserReady] = useState(false);

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

  // Get post data - only after user is ready
  const post = useQuery(
    api.posts.getById,
    userReady ? { id: postId } : "skip"
  );

  const isLoading = post === undefined;
  const error = post === null;

  if (!userReady || isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
          <span className="text-slate-300">Loading post...</span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Post Not Found</h1>
          <p className="text-slate-400">
            The post you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return <PostEditor initialData={post} mode="edit" />;
}