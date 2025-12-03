import { create } from "zustand";
import { persist } from "zustand/middleware";
import { decrypt, encrypt } from "../utils/reUsableFunction";

type AppStoreType = {
  store: Record<string, unknown>;
  set: (key: string, value: unknown) => void;
  get: (key: string) => unknown;
  remove: (key: string) => void;
  clear: () => void;
};

export const useAppStore = create<AppStoreType>()(
  persist(
    (set, get) => ({
      store: {},
      set: (key, value) =>
        set((state) => ({ store: { ...state.store, [key]: value } })),
      get: (key) => get().store[key],
      remove: (key) =>
        set((state) => {
          const newStore = { ...state.store };
          delete newStore[key];
          return { store: newStore };
        }),
      clear: () => set({ store: {} }),
    }),
    {
      name: "app-store",
      storage: {
        getItem: (name) => {
          const raw = localStorage.getItem(name);
          if (!raw) return null;
         const decrypted = decrypt(raw);
         return { state: decrypted };
        },
        setItem: (name, value) => {
          const encrypted = encrypt(value.state);
          localStorage.setItem(name, encrypted);
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);