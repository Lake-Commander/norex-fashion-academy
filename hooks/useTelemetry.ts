// hooks/useTelemetry.ts
"use client";

import { useSession } from "next-auth/react";

export type TelemetryActionType = 
  | "track_read" 
  | "track_video" 
  | "track_product" 
  | "track_course";

export function useTelemetry() {
  const { status } = useSession();

  const trackInteraction = async (actionType: TelemetryActionType, telemetryData: string) => {
    // Silent escape wrapper line: Don't spam the API server if a guest is browsing anonymous pages
    if (status !== "authenticated" || !telemetryData) return;

    try {
      await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actionType, telemetryData }),
      });
    } catch (err) {
      console.error("Telemetry background packet propagation failed:", err);
    }
  };

  return {
    trackRead: (articleId: string) => trackInteraction("track_read", articleId),
    trackVideo: (youtubeId: string) => trackInteraction("track_video", youtubeId),
    trackProduct: (productId: string) => trackInteraction("track_product", productId),
    trackCourse: (courseId: string) => trackInteraction("track_course", courseId),
  };
}