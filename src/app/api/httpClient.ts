import axios, { AxiosError } from "axios";

import { API_BASE_URL } from "./endpoints";
import { getStoredToken } from "./client";

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

httpClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getErrorMessage(error: unknown): string {
  const err = error as AxiosError<{ detail?: string; error?: string }>;
  const detail = err.response?.data?.detail || err.response?.data?.error;
  return detail || err.message;
}
