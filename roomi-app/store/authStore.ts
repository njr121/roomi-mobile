import { create } from "zustand";
import * as Storage from "@/lib/storage";
import { User } from "@/types";

type AuthState = {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  restore: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoggedIn: false,

  login: async (token, user) => {
    await Storage.setItem("token", token);
    await Storage.setItem("user", JSON.stringify(user));
    set({ token, user, isLoggedIn: true });
  },

  logout: async () => {
    await Storage.deleteItem("token");
    await Storage.deleteItem("user");
    set({ token: null, user: null, isLoggedIn: false });
  },

  restore: async () => {
    const token = await Storage.getItem("token");
    const userJson = await Storage.getItem("user");

    if (token && userJson) {
      set({ token, user: JSON.parse(userJson), isLoggedIn: true });
    }
  },
}));
