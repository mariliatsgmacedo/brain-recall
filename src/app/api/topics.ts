import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "./client";
import type { Topic } from "../../domain/topic";

interface ApiTopic {
  id: string;
  title: string;
  description?: string | null;
  added_at: string;
  current_cycle: number;
  next_review: string;
  reviews?: { id: string; cycle_index: number; completed_at: string }[];
}

function mapTopic(data: ApiTopic): Topic {
  // Converte snake_case do backend para camelCase usado no front.
  return {
    id: data.id,
    title: data.title,
    description: data.description || "",
    addedAt: data.added_at,
    currentCycle: data.current_cycle,
    nextReview: data.next_review,
    completedCycles: data.reviews?.map((review) => review.completed_at) || [],
  };
}

export function useTopicsQuery(enabled: boolean) {
  return useQuery<Topic[]>({
    queryKey: ["topics"],
    queryFn: async () => {
      const result = await apiFetch<ApiTopic[]>("/topics");
      return result.map(mapTopic);
    },
    enabled,
    initialData: [],
  });
}

export function useCreateTopicMutation() {
  const queryClient = useQueryClient();
  return useMutation<Topic, Error, { title: string; description: string }>({
    mutationFn: async (payload) => {
      const created = await apiFetch<ApiTopic>("/topics", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return mapTopic(created);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["topics"] }),
  });
}

export function useUpdateTopicMutation() {
  const queryClient = useQueryClient();
  return useMutation<Topic, Error, { id: string; title: string; description: string }>({
    mutationFn: async (payload) => {
      const updated = await apiFetch<ApiTopic>(`/topics/${payload.id}`, {
        method: "PUT",
        body: JSON.stringify({ title: payload.title, description: payload.description }),
      });
      return mapTopic(updated);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["topics"] }),
  });
}

export function useDeleteTopicMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      await apiFetch(`/topics/${id}`, { method: "DELETE" });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["topics"] }),
  });
}

export function useCompleteReviewMutation() {
  const queryClient = useQueryClient();
  return useMutation<Topic, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      const updated = await apiFetch<ApiTopic>(`/topics/${id}/review`, { method: "POST" });
      return mapTopic(updated);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["topics"] }),
  });
}
