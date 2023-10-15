import type { StateCreator } from "zustand";

export type FishSlice = {
  fishes: number;
  color: string;
};

export const createFishSlice: StateCreator<FishSlice, [], [], FishSlice> = () => ({
  fishes: 0,
  color: "blue",
});
