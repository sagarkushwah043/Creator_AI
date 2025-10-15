"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  Copy,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PostCard = ({
  post,
  showActions = false,
  showAuthor = true,
  onEdit,
  onDelete,
  onDuplicate,
  className = "",
}) => {
  const [imgError, setImgError] = useState(false); // ✅ Added to safely handle image 503 errors

  const getStatusBadge = (post) => {
    if (post.status === "published") {
      if (post.scheduledFor && post.scheduledFor > Date.now()) {
        return {
          variant: "secondary",
          className: "bg-blue-500/20 text-blue-300 border-blue-500/30",
          label: "Scheduled",
        };
      }
      return {
        variant: "default",
        className: "bg-green-500/20 text-green-300 border-green-500/30",
        label: "Published",
      };
    }
    return {
      variant: "pop",
      className: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      label: "Draft",
    };
  };

  const getPostUrl = () => {
    if (
      post.status === "published" &&
      (post.author?.username || post?.username)
    ) {
      return `/${post.author?.username || post?.username}/${post._id}`;
    }
    return null;
  };

  const statusBadge = getStatusBadge(post);
  const publicUrl = getPostUrl();

  return (
    <Card
      className={`card-glass hover:border-purple-500/50 transition-colors ${className}`}
    >
      <CardContent>
        <div className="space-y-4">
          {/* Featured Image */}
          <Link
            href={publicUrl || "#"}
            className={!publicUrl ? "pointer-events-none" : ""}
            target="_blank"
          >
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src={
                  imgError
                    ? "/placeholder.png"
                    : post.featuredImage ||
                      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074"
                }
                alt={post.title}
                fill
                onError={() => setImgError(true)} // ✅ Fallback if image fails
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </Link>

          {/* Header */}
          <div className="flex items-start justify-between mt-5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant={statusBadge.variant}
                  className={statusBadge.className}
                >
                  {statusBadge.label}
                </Badge>
                {post.scheduledFor && post.scheduledFor > Date.now() && (
                  <div className="flex items-center text-xs text-blue-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(post.scheduledFor).toLocaleDateString()}
                  </div>
                )}
              </div>

              <Link
                href={publicUrl || "#"}
                className={!publicUrl ? "pointer-events-none" : ""}
              >
                <h3 className="text-xl font-bold text-white hover:text-purple-300 transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </Link>
            </div>

            {/* Dropdown Menu */}
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost2"
                    size="icon"
                    className="flex-shrink-0 text-slate-400 hover:text-white transition"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-52 bg-slate-900 border border-slate-700 text-white shadow-lg rounded-lg"
                >
                  {onEdit && (
                    <DropdownMenuItem
                      onClick={() => onEdit(post)}
                      className="hover:bg-purple-600 hover:text-white cursor-pointer"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Post
                    </DropdownMenuItem>
                  )}

                  {publicUrl && (
                    <DropdownMenuItem
                      asChild
                      className="hover:bg-purple-600 hover:text-white cursor-pointer"
                    >
                      <Link href={publicUrl} target="_blank">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Public
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {onDuplicate && (
                    <DropdownMenuItem
                      onClick={() => onDuplicate(post)}
                      className="hover:bg-purple-600 hover:text-white cursor-pointer"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                  )}

                  {onDelete && (
                    <>
                      <DropdownMenuSeparator className="bg-slate-700" />
                      <DropdownMenuItem
                        onClick={() => onDelete(post)}
                        className="text-red-400 hover:bg-red-600/20 hover:text-red-300 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Post
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Author */}
          {showAuthor && post.author && (
            <div className="flex items-center space-x-3">
              <div className="relative w-8 h-8">
                {post.author.imageUrl ? (
                  <Image
                    src={post.author.imageUrl}
                    alt={post.author.name}
                    fill
                    className="rounded-full object-cover"
                    sizes="32px"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm font-bold">
                    {post.author.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {post.author.name}
                </p>
                {post.author.username && (
                  <p className="text-xs text-slate-400">
                    @{post.author.username}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs"
                >
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge
                  variant="secondary"
                  className="bg-slate-500/20 text-slate-300 border-slate-500/30 text-xs"
                >
                  +{post.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {post.viewCount?.toLocaleString() || 0}
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {post.likeCount?.toLocaleString() || 0}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />0
              </div>
            </div>
            <time>
              {post.status === "published" && post.publishedAt
                ? formatDistanceToNow(new Date(post.publishedAt), {
                    addSuffix: true,
                  })
                : formatDistanceToNow(new Date(post.updatedAt), {
                    addSuffix: true,
                  })}
            </time>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
