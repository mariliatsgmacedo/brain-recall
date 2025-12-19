import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useStudyStore } from './useStudyStore';

const STORAGE_KEY = 'brain-recall-auth-v1';

interface Account {
  name: string;
  email: string;
  password: string;
}

interface AuthState {
  account: Account | null;
  isAuthenticated: boolean;
  signup: (data: { name: string; email: string; password: string }) => { success: boolean; error?: string };
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => { success: boolean; error?: string };
  deleteAccount: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      account: null,
      isAuthenticated: false,

      signup: ({ name, email, password }) => {
        if (get().account) {
          return { success: false, error: 'Já existe uma conta criada neste dispositivo.' };
        }

        set({
          account: { name, email, password },
          isAuthenticated: true,
        });

        return { success: true };
      },

      login: (email, password) => {
        const account = get().account;

        if (!account) {
          return { success: false, error: 'Nenhuma conta encontrada. Crie uma conta para continuar.' };
        }

        if (account.email !== email || account.password !== password) {
          return { success: false, error: 'Credenciais inválidas.' };
        }

        set({ isAuthenticated: true });
        return { success: true };
      },

      logout: () => {
        set({ isAuthenticated: false });
      },

      resetPassword: (email, newPassword) => {
        const account = get().account;

        if (!account || account.email !== email) {
          return { success: false, error: 'Não encontramos uma conta com este e-mail.' };
        }

        set({ account: { ...account, password: newPassword } });
        return { success: true };
      },

      deleteAccount: () => {
        useStudyStore.getState().reset();
        set({ account: null, isAuthenticated: false });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
