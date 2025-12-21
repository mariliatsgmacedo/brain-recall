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
} as const;

export { API_BASE_URL };
