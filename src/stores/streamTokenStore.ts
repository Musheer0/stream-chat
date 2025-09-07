import { create } from 'zustand';

interface StreamTokenState {
  token: string | null;
  setToken: (token: string | null) => void;
}

export const useStreamTokenStore = create<StreamTokenState>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
}));
