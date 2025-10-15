"use client";

import { useStoreUserEffect } from "@/hooks/use-store-user";

export function StoreUserProvider({ children }) {
  useStoreUserEffect();
  return children;
}