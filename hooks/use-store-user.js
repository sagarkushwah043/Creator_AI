import { useUser } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export function useStoreUser() {
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    async function createUser() {
      try {
        const id = await storeUser();
        if (isMounted) {
          setUserId(id);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to store user:", err);
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    createUser();

    return () => {
      isMounted = false;
      setUserId(null);
      setError(null);
    };
  }, [isAuthenticated, storeUser, user?.id]);
  // Combine the local state with the state from context
  return {
    isLoading: isLoading || (isAuthenticated && userId === null),
    isAuthenticated: isAuthenticated && userId !== null,
  };
}