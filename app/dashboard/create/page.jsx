"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, Loader2, User } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import PostEditor from "@/components/post-editor";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreatePostPage() {
  const [userReady, setUserReady] = useState(false);
  
  // Store user on mount
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    // Create user if they don't exist
    storeUser()
      .then(() => setUserReady(true))
      .catch((err) => {
        console.error("Failed to store user:", err);
        setUserReady(true); // Set to true anyway to show data
      });
  }, [storeUser]);

  // Get existing draft - only after user is ready
  const existingDraft = useQuery(
    api.posts.getUserDraft,
    userReady ? {} : "skip"
  );

  // Get current user - only after user is ready
  const currentUser = useQuery(
    api.users.getCurrentUser,
    userReady ? {} : "skip"
  );

  const isDraftLoading = existingDraft === undefined;
  const userLoading = currentUser === undefined;

  if (!userReady || isDraftLoading || userLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
          <span className="text-slate-300">Loading...</span>
        </div>
      </div>
    );
  }

  // Check if the current user has a username
  if (!currentUser?.username) {
    return (
      <div className="h-80 bg-slate-900 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center space-y-6">
          <h1 className="text-3xl font-bold text-white">Username Required</h1>
          <p className="text-slate-400 text-lg">
            Set up a username to create and share your posts
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard/settings">
              <Button variant="primary">
                Set Up Username
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <PostEditor initialData={existingDraft} mode="create" />;
}