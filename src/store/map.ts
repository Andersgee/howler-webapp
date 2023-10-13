import type { StateCreator } from "zustand";

export type MapSlice = {
  isLoaded: boolean;
  tileIdsInView: string[];
};

export const createMapSlice: StateCreator<MapSlice, [], [], MapSlice> = () => ({
  isLoaded: false,
  tileIdsInView: [],
});
