import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TOPIC_ENDPOINTS } from "../api/endpoints";
import { httpClient, getErrorMessage } from "../api/httpClient";
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
      try {
        const { data } = await httpClient.get<ApiTopic[]>(TOPIC_ENDPOINTS.base);
        return data.map(mapTopic);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    enabled,
    initialData: [],
  });
}

export function useCreateTopicMutation() {
  const queryClient = useQueryClient();

  return useMutation<Topic, Error, { title: string; description: string }>({
    mutationFn: async (payload) => {
      try {
        const { data } = await httpClient.post<ApiTopic>(TOPIC_ENDPOINTS.base, payload);
        return mapTopic(data);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["topics"] }),
  });
}

export function useUpdateTopicMutation() {
  const queryClient = useQueryClient();

  return useMutation<Topic, Error, { id: string; title: string; description: string }>({
    mutationFn: async (payload) => {
      try {
        const { data } = await httpClient.put<ApiTopic>(TOPIC_ENDPOINTS.byId(payload.id), {
          title: payload.title,
          description: payload.description,
        });
        return mapTopic(data);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["topics"] }),
  });
}

export function useDeleteTopicMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      try {
        await httpClient.delete(TOPIC_ENDPOINTS.byId(id));
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["topics"] }),
  });
}

export function useCompleteReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation<Topic, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      try {
        const { data } = await httpClient.post<ApiTopic>(TOPIC_ENDPOINTS.review(id));
        return mapTopic(data);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["topics"] }),
  });
}
