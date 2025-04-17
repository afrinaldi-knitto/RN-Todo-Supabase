import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { supabase } from "../lib/supabase";

export interface Todo {
  id: number;
  description: string;
  is_done: boolean;
}

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;

  fetchTodos: (userId: number) => Promise<void>;
  addTodo: (userId: number, description: string) => Promise<void>;
  toggleTodo: (id: number, newState: boolean) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  clear: () => void;
}

const useTodoStore = create<TodoState>()(
  devtools((set, get) => ({
    todos: [],
    loading: false,
    error: null,

    fetchTodos: async (userId) => {
      try {
        set({ loading: true });
        const { data, error } = await supabase
          .from("todos")
          .select("id, description, is_done")
          .eq("user_id", userId)
          .order("id", { ascending: false });

        if (error) throw error;
        set({ todos: data ?? [] });
      } catch (e: any) {
        set({ error: e.message ?? "Gagal memuat todo." });
      } finally {
        set({ loading: false });
      }
    },

    addTodo: async (userId, description) => {
      try {
        const { data, error } = await supabase
          .from("todos")
          .insert({ user_id: userId, description, is_done: false })
          .select("id, description, is_done")
          .single();

        if (error) throw error;
        set({ todos: [data as Todo, ...get().todos] });
      } catch (e: any) {
        set({ error: e.message ?? "Gagal menambah todo." });
      }
    },

    toggleTodo: async (id, newState) => {
      try {
        const { error } = await supabase
          .from("todos")
          .update({ is_done: newState })
          .eq("id", id);

        if (error) throw error;
        set({
          todos: get().todos.map((t) =>
            t.id === id ? { ...t, is_done: newState } : t
          ),
        });
      } catch (e: any) {
        set({ error: e.message ?? "Gagal memperbarui todo." });
      }
    },

    deleteTodo: async (id) => {
      try {
        const { error } = await supabase.from("todos").delete().eq("id", id);
        if (error) throw error;
        set({ todos: get().todos.filter((t) => t.id !== id) });
      } catch (e: any) {
        set({ error: e.message ?? "Gagal menghapus todo." });
      }
    },

    clear: () => set({ todos: [], error: null }),
  }))
);

export default useTodoStore;
