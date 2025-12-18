import { startOfDay, isAfter } from 'date-fns';
import { useMemo } from 'react';
import type { Topic } from '../../../domain/topic';

export function useSortedTopics(topics: Topic[]) {
  return useMemo(() => {
    const today = startOfDay(new Date());
    const needsReview = topics.filter((topic) => !isAfter(new Date(topic.nextReview), today));
    const upcoming = topics.filter((topic) => isAfter(new Date(topic.nextReview), today));

    needsReview.sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime());
    upcoming.sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime());

    return { needsReview, upcoming };
  }, [topics]);
}

