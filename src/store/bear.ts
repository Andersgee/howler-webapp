import type { StateCreator } from "zustand";

export type BearSlice = {
  bears: number;
  color: string;
  increment: () => void;
};

export const createBearSlice: StateCreator<BearSlice, [], [], BearSlice> = (set, get) => ({
  bears: 0,
  color: "brown",
  increment: () => set((prev) => ({ bears: prev.bears + 1 })),
});
