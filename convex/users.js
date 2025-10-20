import { mutation, query } from "./_generated/server";

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity before.
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (user !== null) {
      // If the name has changed, patch it
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, { name: identity.name });
      }
      return user._id;
    }

    // If it's a new identity, create a new User
    const timestamp = Date.now();
    const newUser = {
      name: identity.firstName ? `${identity.firstName} ${identity.lastName ?? ""}` : "Anonymous",
      email: identity.email ?? "",
      tokenIdentifier: identity.tokenIdentifier,
      imageUrl: identity.pictureUrl ?? "",
      username: identity.email?.split("@")[0] ?? "user",
      createdAt: timestamp,
      lastActiveAt: timestamp,
      dailyViews: [],
    };

    try {
      const userId = await ctx.db.insert("users", newUser);
      console.log("User created successfully:", userId);
      return userId;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called getCurrentUser without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
});

export const getDailyViews = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called getDailyViews without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      return [];
    }

    return user.dailyViews || [];
  },
});

export const updateDailyViews = mutation({
  args: {
    date: "string",
    views: "number",
  },
  handler: async (ctx, { date, views }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called updateDailyViews without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const dailyViews = user.dailyViews || [];
    const existingIndex = dailyViews.findIndex((dv) => dv.date === date);

    if (existingIndex >= 0) {
      dailyViews[existingIndex].views = views;
    } else {
      dailyViews.push({ date, views });
    }

    await ctx.db.patch(user._id, { dailyViews });
    return user._id;
  },
});

export const incrementDailyViews = mutation({
  args: {
    date: "string",
  },
  handler: async (ctx, { date }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called incrementDailyViews without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const dailyViews = user.dailyViews || [];
    const existingIndex = dailyViews.findIndex((dv) => dv.date === date);

    if (existingIndex >= 0) {
      dailyViews[existingIndex].views += 1;
    } else {
      dailyViews.push({ date, views: 1 });
    }

    await ctx.db.patch(user._id, { dailyViews });
    return user._id;
  },
});