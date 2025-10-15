"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ConvexTest() {
  const test = useQuery(api.test.getTest);

  return (
    <div className="fixed bottom-4 right-4 bg-slate-800 p-4 rounded-lg shadow-lg">
      {test ? (
        <p className="text-green-400">{test.status}</p>
      ) : (
        <p className="text-yellow-400">Connecting to Convex...</p>
      )}
    </div>
  );
}