import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { setStoredToken, getStoredToken } from "../app/api/client";

const STORAGE_KEY = "brain-recall-auth-v2";

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
}

// Keep auth token persisted; actual requests use TanStack Query + fetch wrapper.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: getStoredToken(),
      setToken: (token) => {
        setStoredToken(token);
        set({ token });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
