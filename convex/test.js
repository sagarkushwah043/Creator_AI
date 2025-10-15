import { query } from "./_generated/server";

export const getTest = query({
  args: {},
  handler: async (ctx) => {
    return { status: "Connected to Convex!" };
  },
});