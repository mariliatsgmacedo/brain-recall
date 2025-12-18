import { addDays, startOfDay } from 'date-fns';

export const REVIEW_INTERVALS_DAYS = [1, 7, 15, 30] as const;

export type ReviewCycleIndex = number;

export function clampCycleIndex(index: number): number {
  return Math.min(Math.max(index, 0), REVIEW_INTERVALS_DAYS.length - 1);
}

export function nextReviewIsoForCycle(cycleIndex: number, now: Date): string {
  const normalized = startOfDay(now);
  const safeIndex = clampCycleIndex(cycleIndex);
  return addDays(normalized, REVIEW_INTERVALS_DAYS[safeIndex]).toISOString();
}

