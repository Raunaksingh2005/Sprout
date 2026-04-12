// Client-side cache for screenings data
// Uses sessionStorage so it persists across page navigations within the same tab
// but clears when the tab is closed (appropriate for sensitive health data)

import type { ScreeningResult } from '@/lib/firebase/screenings';

const CACHE_KEY_PREFIX = 'sprout_screenings_';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  data: ScreeningResult[];
  cachedAt: number;
}

export function getCached(uid: string): ScreeningResult[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY_PREFIX + uid);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
      sessionStorage.removeItem(CACHE_KEY_PREFIX + uid);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

export function setCache(uid: string, data: ScreeningResult[]): void {
  if (typeof window === 'undefined') return;
  try {
    const entry: CacheEntry = { data, cachedAt: Date.now() };
    sessionStorage.setItem(CACHE_KEY_PREFIX + uid, JSON.stringify(entry));
  } catch {
    // sessionStorage full or unavailable — fail silently
  }
}

export function invalidateCache(uid: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(CACHE_KEY_PREFIX + uid);
  } catch {}
}
