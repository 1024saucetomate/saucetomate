import { getIp } from "./get-ip";

const trackers: Record<
  string,
  {
    count: number;
    expiresAt: number;
  }
> = {};

export async function isRateLimited(limit: number = 1, window: number = 60 * 1000) {
  const ip = await getIp();
  if (!ip) {
    return true;
  }

  const tracker = trackers[ip] || { count: 0, expiresAt: 0 };
  if (!trackers[ip]) {
    trackers[ip] = tracker;
  }

  if (tracker.expiresAt < Date.now()) {
    tracker.count = 0;
    tracker.expiresAt = Date.now() + window;
  }

  tracker.count++;

  if (tracker.count > limit) {
    return true;
  } else {
    return false;
  }
}
