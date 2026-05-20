import type { Region, Trek } from "@/lib/types";

// Each current Arunachal trek carries its verified YouTube ID directly in
// src/data/places.ts. No legacy regional fallback videos are retained.
export const REGION_VIDEOS: Partial<Record<Region, string>> = {};

export function trekVideo(trek: Trek): string | undefined {
    return trek.video ?? REGION_VIDEOS[trek.region];
    
}
