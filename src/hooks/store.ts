import { create } from "zustand";

type BearState = {
  bears: number;
  text: string;
  //increase: (by: number) => void;
};

export const useBearStore = create<BearState>()(() => ({
  bears: 0,
  text: "hello",

  //increase: (by) => set((state) => ({ bears: state.bears + by })),
  //removeAllBears: () => set({ bears: 0 }),
}));

export const increaseBears = (by: number) => useBearStore.setState((state) => ({ bears: state.bears + by }));
export const setText = (text: string) => useBearStore.setState({ text });
