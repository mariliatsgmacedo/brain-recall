import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TOPIC_ENDPOINTS } from "../api/endpoints";
import { getErrorMessage, httpClient } from "../api/httpClient";
import type {
  AnswerResult,
  OptionKey,
  ReviewQuestionState,
  TopicQuestion,
} from "../../domain/question";

interface ApiQuestionOption {
  key: OptionKey;
  text: string;
}

interface ApiQuestion {
  id: string;
  topic_id: string;
  question: string;
  options: ApiQuestionOption[];
  correct_option: OptionKey;
  status: "ACTIVE" | "INACTIVE";
  source: "USER" | "AI";
  created_at: string;
}

interface ApiNextQuestionResponse {
  active_questions_count: number;
  question: ApiQuestion | null;
  answered_today?: boolean;
}

interface ApiAnswerResponse {
  question_id: string;
  selected_option: OptionKey;
  correct_option: OptionKey;
  is_correct: boolean;
  active_questions_count?: number;
  next_question?: ApiQuestion | null;
}

function mapQuestion(api: ApiQuestion): TopicQuestion {
  return {
    id: api.id,
    topicId: api.topic_id,
    question: api.question,
    options: api.options,
    correctOption: api.correct_option,
    status: api.status,
    source: api.source,
    createdAt: api.created_at,
  };
}

function mapNextQuestionResponse(data: ApiNextQuestionResponse): ReviewQuestionState {
  return {
    activeQuestionsCount: data.active_questions_count,
    question: data.question ? mapQuestion(data.question) : null,
    answeredToday: Boolean(data.answered_today),
  };
}

export function useNextReviewQuestion(topicId: string, enabled: boolean) {
  return useQuery<ReviewQuestionState>({
    queryKey: ["review-question", topicId],
    queryFn: async () => {
      try {
        const { data } = await httpClient.get<ApiNextQuestionResponse>(
          TOPIC_ENDPOINTS.reviewQuestion(topicId)
        );
        return mapNextQuestionResponse(data);
      } catch (error) {
        return {
          activeQuestionsCount: 0,
          question: null,
          apiUnavailable: true,
          errorMessage: getErrorMessage(error),
        };
      }
    },
    enabled,
    retry: false,
  });
}

export function useAnswerQuestionMutation(topicId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    { result: AnswerResult; nextQuestion: TopicQuestion | null; activeQuestionsCount: number },
    Error,
    { questionId: string; selectedOption: OptionKey }
  >({
    mutationFn: async ({ questionId, selectedOption }) => {
      try {
        const { data } = await httpClient.post<ApiAnswerResponse>(
          TOPIC_ENDPOINTS.answerQuestion(topicId, questionId),
          { selected_option: selectedOption }
        );

        return {
          result: {
            questionId: data.question_id,
            selectedOption: data.selected_option,
            correctOption: data.correct_option,
            isCorrect: data.is_correct,
          },
          nextQuestion: data.next_question ? mapQuestion(data.next_question) : null,
          activeQuestionsCount: data.active_questions_count ?? 0,
        };
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["review-question", topicId] });
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      queryClient.invalidateQueries({ queryKey: ["topic", topicId] });
    },
  });
}

export function useGenerateQuestionMutation(topicId: string) {
  const queryClient = useQueryClient();

  return useMutation<TopicQuestion, Error, { summary?: string }>({
    mutationFn: async (payload) => {
      try {
        const { data } = await httpClient.post<TopicQuestion>(
          TOPIC_ENDPOINTS.generateQuestion(topicId),
          payload?.summary ? { summary: payload.summary } : {}
        );
        return data;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review-question", topicId] });
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
  });
}
