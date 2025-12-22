export type OptionKey = "A" | "B" | "C" | "D";

export interface QuestionOption {
  key: OptionKey;
  text: string;
}

export interface TopicQuestion {
  id: string;
  topicId: string;
  question: string;
  options: QuestionOption[];
  correctOption: OptionKey;
  status: "ACTIVE" | "INACTIVE";
  source: "USER" | "AI";
  createdAt: string;
}

export interface QuestionAttempt {
  topicId: string;
  questionId: string;
  selectedOption: OptionKey;
  isCorrect: boolean;
  createdAt: string;
}

export interface ReviewQuestionState {
  activeQuestionsCount: number;
  question: TopicQuestion | null;
  apiUnavailable?: boolean;
  errorMessage?: string;
}

export interface AnswerResult {
  questionId: string;
  selectedOption: OptionKey;
  correctOption: OptionKey;
  isCorrect: boolean;
}
