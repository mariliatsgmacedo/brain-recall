import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { setStoredToken, getStoredToken } from "../api/client";
import { AUTH_ENDPOINTS } from "../api/endpoints";
import { httpClient, getErrorMessage } from "../api/httpClient";
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
    queryFn: async () => {
      try {
        const response = await httpClient.get<User>(AUTH_ENDPOINTS.me);
        return response.data;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    enabled,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation<AuthToken, Error, { email: string; password: string }>({
    mutationFn: async (payload) => {
      try {
        const response = await httpClient.post<AuthToken>(AUTH_ENDPOINTS.login, payload);
        return response.data;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
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
    mutationFn: async (payload) => {
      try {
        const response = await httpClient.post<AuthToken>(AUTH_ENDPOINTS.signup, payload);
        return response.data;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
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
    mutationFn: async (payload) => {
      try {
        await httpClient.post(AUTH_ENDPOINTS.resetPassword, {
          email: payload.email,
          new_password: payload.newPassword,
        });
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  });
}

export function useDeleteAccountMutation() {
  const queryClient = useQueryClient();
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation<unknown, Error>({
    mutationFn: async () => {
      try {
        await httpClient.delete(AUTH_ENDPOINTS.deleteAccount);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
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
