
"use client";

import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import axios from "@/lib/axios";

export default function StudentAuthSync() {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  const pathname = usePathname();
  const syncedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname.startsWith("/student/")) return;

    if (!isLoaded || !isSignedIn || !userId) {
      syncedUserId.current = null;
      return;
    }

    if (syncedUserId.current === userId) return;

    let cancelled = false;

    const syncStudent = async () => {
      try {
        const token = await getToken();
        if (!token || cancelled) return;

        await axios.post(
          "/student-auth/verify",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!cancelled) {
          syncedUserId.current = userId;
      
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Student authentication sync failed:", error);
        }
      }
    };

    void syncStudent();

    return () => {
      cancelled = true;
    };
  }, [pathname, isLoaded, isSignedIn, userId, getToken]);

  return null;
}
