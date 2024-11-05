import type { RateLimitTracker } from "@/utils/interfaces";

import { getIp } from "./get-ip";

const trackers: Record<string, RateLimitTracker> = {};

export const isRateLimited = async (limit: number = 1, window: number = 60 * 5 * 1000): Promise<boolean> => {
  const ip = await getIp();
  if (!ip) return true;

  const tracker = trackers[ip] || { count: 0, expiresAt: 0 };
  if (!trackers[ip]) trackers[ip] = tracker;

  if (tracker.expiresAt < Date.now()) {
    tracker.count = 0;
    tracker.expiresAt = Date.now() + window;
  }

  tracker.count++;

  return tracker.count > limit;
};
