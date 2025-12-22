const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const AUTH_ENDPOINTS = {
  login: "/auth/login",
  signup: "/auth/signup",
  me: "/auth/me",
  resetPassword: "/auth/reset-password",
  deleteAccount: "/auth/account",
} as const;

export const TOPIC_ENDPOINTS = {
  base: "/topics",
  byId: (id: string) => `/topics/${id}`,
  review: (id: string) => `/topics/${id}/review`,
  reviewQuestion: (id: string) => `/topics/${id}/review/next-question`,
  answerQuestion: (topicId: string, questionId: string) =>
    `/topics/${topicId}/review/questions/${questionId}/attempts`,
  generateQuestion: (id: string) => `/topics/${id}/questions/ai-generate`,
  aiQuestions: "/topics/questions/ai",
} as const;

export { API_BASE_URL };
