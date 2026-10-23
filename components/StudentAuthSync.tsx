"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

export default function StudentAuthSync() {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  const syncedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) {
      syncedUserId.current = null;
      return;
    }

    if (syncedUserId.current === userId) return;

    let cancelled = false;

    const syncStudent = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/student-auth/verify`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Student sync failed: ${response.status}`);
        }

        const data = await response.json();

        if (!cancelled) {
          syncedUserId.current = userId;
          console.log("Student synced successfully:", data);
        }
      } catch (error) {
        console.error("Student authentication sync failed:", error);
      }
    };

    void syncStudent();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, userId, getToken]);

  return null;
}