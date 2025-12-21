import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, setStoredToken, getStoredToken } from "./client";
import { useAuthStore } from "../../store/useAuthStore";

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export function useMeQuery(enabled: boolean) {
  return useQuery<User>({
    queryKey: ["me"],
    queryFn: () => apiFetch<User>("/auth/me"),
    enabled,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const setToken = useAuthStore((state) => state.setToken);
  return useMutation<AuthToken, Error, { email: string; password: string }>({
    mutationFn: (payload) =>
      apiFetch<AuthToken>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: (data) => {
      // Log básico para inspeção de fluxo de login (não inclui senha)
      console.info("[auth] login bem-sucedido para", new Date().toISOString());
      setStoredToken(data.access_token);
      setToken(data.access_token);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
    onError: (error) => {
      console.error("[auth] erro no login:", error.message);
    },
  });
}

export function useSignupMutation() {
  const queryClient = useQueryClient();
  const setToken = useAuthStore((state) => state.setToken);
  return useMutation<AuthToken, Error, { name: string; email: string; password: string }>({
    mutationFn: (payload) =>
      apiFetch<AuthToken>("/auth/signup", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: (data) => {
      // Log para acompanhar criação de conta
      console.info("[auth] signup bem-sucedido em", new Date().toISOString());
      setStoredToken(data.access_token);
      setToken(data.access_token);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["topics"] });
    },
    onError: (error) => {
      console.error("[auth] erro no signup:", error.message);
    },
  });
}

export function useResetPasswordMutation() {
  return useMutation<unknown, Error, { email: string; newPassword: string }>({
    mutationFn: (payload) =>
      apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email: payload.email, new_password: payload.newPassword }),
      }),
  });
}

export function useDeleteAccountMutation() {
  const queryClient = useQueryClient();
  const setToken = useAuthStore((state) => state.setToken);
  return useMutation<unknown, Error>({
    mutationFn: () =>
      apiFetch("/auth/account", {
        method: "DELETE",
      }),
    onSuccess: () => {
      setStoredToken(null);
      setToken(null);
      queryClient.clear();
    },
  });
}

export function logout() {
  setStoredToken(null);
  useAuthStore.getState().setToken(null);
}

export function isAuthenticated(): boolean {
  return Boolean(getStoredToken());
}
