import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Create sample users
    const user1Id = await ctx.db.insert("users", {
      name: "Alice Johnson",
      email: "alice@example.com",
      tokenIdentifier: "test-token-alice",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      username: "alice_johnson",
      bio: "AI researcher and tech enthusiast. Love writing about emerging technologies.",
      role: "admin",
      createdAt: now,
      lastActiveAt: now,
      postsCount: 3,
      followersCount: 2,
      followingCount: 1,
    });

    const user2Id = await ctx.db.insert("users", {
      name: "Bob Smith",
      email: "bob@example.com",
      tokenIdentifier: "test-token-bob",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
      username: "bob_smith",
      bio: "Software developer sharing insights about AI and web development",
      role: "user",
      createdAt: now,
      lastActiveAt: now,
      postsCount: 2,
      followersCount: 1,
      followingCount: 2,
    });

    // Create sample posts
    const post1Id = await ctx.db.insert("posts", {
      title: "Getting Started with AI Development",
      content: `<h2>Introduction to AI Development</h2>
<p>Artificial Intelligence is revolutionizing how we build software...</p>
<h2>Key Concepts</h2>
<p>Understanding these fundamental concepts is crucial...</p>
<h2>Practical Applications</h2>
<p>Let's look at some real-world applications...</p>`,
      status: "published",
      authorId: user1Id,
      tags: ["AI", "Programming", "Technology"],
      category: "Technology",
      featuredImage: "https://source.unsplash.com/random/800x600/?ai",
      createdAt: now - 86400000, // 1 day ago
      updatedAt: now - 86400000,
      publishedAt: now - 86400000,
      viewCount: 150,
      likeCount: 25,
    });

    const post2Id = await ctx.db.insert("posts", {
      title: "The Future of Web Development with AI",
      content: `<h2>AI in Modern Web Development</h2>
<p>AI is changing how we approach web development...</p>
<h2>Tools and Frameworks</h2>
<p>Several AI-powered tools are making waves...</p>`,
      status: "published",
      authorId: user2Id,
      tags: ["Web Development", "AI", "Future Tech"],
      category: "Development",
      featuredImage: "https://source.unsplash.com/random/800x600/?coding",
      createdAt: now - 172800000, // 2 days ago
      updatedAt: now - 172800000,
      publishedAt: now - 172800000,
      viewCount: 120,
      likeCount: 18,
    });

    // Create sample comments
    await ctx.db.insert("comments", {
      postId: post1Id,
      authorId: user2Id,
      authorName: "Bob Smith",
      content: "Great article! Very informative.",
      status: "approved",
      createdAt: now - 43200000, // 12 hours ago
    });

    await ctx.db.insert("comments", {
      postId: post2Id,
      authorId: user1Id,
      authorName: "Alice Johnson",
      content: "Excellent insights into the future of web development!",
      status: "approved",
      createdAt: now - 21600000, // 6 hours ago
    });

    // Create likes
    await ctx.db.insert("likes", {
      postId: post1Id,
      userId: user2Id,
      createdAt: now - 3600000, // 1 hour ago
    });

    await ctx.db.insert("likes", {
      postId: post2Id,
      userId: user1Id,
      createdAt: now - 7200000, // 2 hours ago
    });

    // Create follows
    await ctx.db.insert("follows", {
      followerId: user2Id,
      followingId: user1Id,
      createdAt: now - 259200000, // 3 days ago
    });

    // Create daily stats
    const today = new Date().toISOString().split('T')[0];
    await ctx.db.insert("dailyStats", {
      postId: post1Id,
      date: today,
      views: 150,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("dailyStats", {
      postId: post2Id,
      date: today,
      views: 120,
      createdAt: now,
      updatedAt: now,
    });

    return {
      message: "Database seeded successfully!",
      users: [user1Id, user2Id],
      posts: [post1Id, post2Id],
    };
  },
});