import { useQuery } from "@tanstack/react-query";
import { TOPIC_ENDPOINTS } from "../api/endpoints";
import { httpClient, getErrorMessage } from "../api/httpClient";
import type { QuestionOption } from "../../domain/question";

export interface AiQuestion {
  id: string;
  topicId: string;
  topicTitle: string;
  question: string;
  options: QuestionOption[];
  status: "ACTIVE" | "INACTIVE";
  source: "USER" | "AI";
  createdAt: string;
}

interface ApiAiQuestion {
  id: string;
  topic_id: string;
  topic_title: string;
  question: string;
  options: QuestionOption[];
  status: "ACTIVE" | "INACTIVE";
  source: "USER" | "AI";
  created_at: string;
}

function mapAiQuestion(api: ApiAiQuestion): AiQuestion {
  return {
    id: api.id,
    topicId: api.topic_id,
    topicTitle: api.topic_title,
    question: api.question,
    options: api.options,
    status: api.status,
    source: api.source,
    createdAt: api.created_at,
  };
}

export function useAiQuestionsQuery(enabled: boolean) {
  return useQuery<AiQuestion[]>({
    queryKey: ["ai-questions"],
    enabled,
    initialData: [],
    queryFn: async () => {
      try {
        const { data } = await httpClient.get<ApiAiQuestion[]>(TOPIC_ENDPOINTS.aiQuestions);
        return data.map(mapAiQuestion);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  });
}
