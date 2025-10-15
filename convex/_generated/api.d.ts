/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as comments from "../comments.js";
import type * as dashboard from "../dashboard.js";
import type * as feed from "../feed.js";
import type * as followers from "../followers.js";
import type * as likes from "../likes.js";
import type * as posts from "../posts.js";
import type * as public_ from "../public.js";
import type * as seedData from "../seedData.js";
import type * as seedUsers from "../seedUsers.js";
import type * as test from "../test.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  comments: typeof comments;
  dashboard: typeof dashboard;
  feed: typeof feed;
  followers: typeof followers;
  likes: typeof likes;
  posts: typeof posts;
  public: typeof public_;
  seedData: typeof seedData;
  seedUsers: typeof seedUsers;
  test: typeof test;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
