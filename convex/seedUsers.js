import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const seedUsers = mutation({
  handler: async (ctx) => {
    const now = Date.now();

    // Example users
    const users = [
      {
        name: "Alice Smith",
        username: "alice",
        email: "alice@example.com",
        tokenIdentifier: "alice-token-001",
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
        createdAt: now,
        lastActiveAt: now,
      },
      {
        name: "Bob Johnson",
        username: "bob",
        email: "bob@example.com",
        tokenIdentifier: "bob-token-002",
        imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
        createdAt: now,
        lastActiveAt: now,
      },
      {
        username: "charlie",
        email: "charlie@example.com",
        tokenIdentifier: "charlie-token-003",
        createdAt: now,
      },
    ];

    for (const user of users) {
      // Check if user exists to avoid duplicates
      const existing = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("tokenIdentifier"), user.tokenIdentifier))
        .unique();

      if (!existing) {
        await ctx.db.insert("users", user);
      }
    }

    return { success: true, message: "Seed users inserted" };
  },
});
