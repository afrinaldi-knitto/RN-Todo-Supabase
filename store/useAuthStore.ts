import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { supabase } from "../lib/supabase";

interface AuthState {
  userId: number | null;
  loading: boolean;
  error: string | null;

  login: (username: string, password: string) => Promise<number | null>;
  register: (username: string, password: string) => Promise<void>;
  logoutRuntime: () => void;
  setError: (msg: string | null) => void;
}

const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    userId: null,
    loading: false,
    error: null,

    setError: (msg) => set({ error: msg }),

    login: async (username, password) => {
      try {
        set({ loading: true, error: null });

        const { data, error } = await supabase
          .from("users")
          .select("id, password")
          .eq("username", username)
          .single();

        if (!data || data.password !== password || error) {
          set({ error: "Username atau password salah." });
          return null;
        }

        set({ userId: data.id });
        return data.id;
      } catch (e: any) {
        set({ error: e.message ?? "Terjadi kesalahan." });
        return null;
      } finally {
        set({ loading: false });
      }
    },

    register: async (username, password) => {
      try {
        set({ loading: true, error: null });

        const { data: existing } = await supabase
          .from("users")
          .select("id")
          .eq("username", username)
          .single();

        if (existing) {
          set({ error: "Username sudah terpakai." });
          return;
        }

        const { error } = await supabase
          .from("users")
          .insert({ username, password });

        if (error) throw error;
      } catch (e: any) {
        set({ error: e.message ?? "Terjadi kesalahan." });
      } finally {
        set({ loading: false });
      }
    },

    logoutRuntime: () => set({ userId: null }),
  }))
);

export default useAuthStore;
