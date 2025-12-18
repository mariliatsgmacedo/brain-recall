import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { addDays, startOfDay } from 'date-fns';
import { nextReviewIsoForCycle, REVIEW_INTERVALS_DAYS } from '../domain/review';
import type { Topic } from '../domain/topic';

const STORAGE_KEY = 'brain-recall-storage-v3';

interface StudyStoreState {
  topics: Topic[];
  addTopic: (title: string, description: string) => void;
  updateTopic: (id: string, data: { title: string; description: string }) => void;
  completeReview: (id: string) => void;
  deleteTopic: (id: string) => void;
}

export const useStudyStore = create<StudyStoreState>()(
  persist(
    (set) => ({
      topics: [],

      addTopic: (title, description) =>
        set((state) => ({
          topics: [
            ...state.topics,
            {
              id: crypto.randomUUID(),
              title,
              description,
              addedAt: new Date().toISOString(),
              currentCycle: 0,
              nextReview: nextReviewIsoForCycle(0, new Date()),
              completedCycles: [],
            },
          ],
        })),

      updateTopic: (id, data) =>
        set((state) => ({
          topics: state.topics.map((topic) => (topic.id === id ? { ...topic, ...data } : topic)),
        })),

      completeReview: (id) =>
        set((state) => ({
          topics: state.topics.map((topic) => {
            if (topic.id !== id) return topic;

            const isLastCycle = topic.currentCycle >= REVIEW_INTERVALS_DAYS.length - 1;
            const nextCycleIndex = isLastCycle ? topic.currentCycle : topic.currentCycle + 1;

            return {
              ...topic,
              currentCycle: nextCycleIndex,
              completedCycles: [...topic.completedCycles, new Date().toISOString()],
              nextReview: isLastCycle
                ? addDays(startOfDay(new Date()), 365).toISOString()
                : nextReviewIsoForCycle(nextCycleIndex, new Date()),
            };
          }),
        })),

      deleteTopic: (id) =>
        set((state) => ({
          topics: state.topics.filter((topic) => topic.id !== id),
        })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
