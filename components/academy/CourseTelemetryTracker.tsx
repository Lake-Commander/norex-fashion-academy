"use client";
import { useEffect } from "react";
import { useTelemetry } from "@/hooks/useTelemetry";

export default function CourseTelemetryTracker({ id }: { id: string }) {
  const { trackCourse } = useTelemetry();
  useEffect(() => { if (id) trackCourse(id); }, [id, trackCourse]);
  return null;
}