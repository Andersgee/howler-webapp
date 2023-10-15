import type { StateCreator } from "zustand";
import type { Prettify } from "#src/utils/typescript";

type Type = "show" | "hide" | "toggle";
type Name = "signin" | "notifications" | "warning";
type Value = Prettify<"none" | Name>;
type Action = { type: Type; name: Name };

export type DialogSlice = {
  dialogValue: Value;
  dialogAction: (action: Action) => void;
};

export const createDialogSlice: StateCreator<DialogSlice, [], [], DialogSlice> = (set) => ({
  dialogValue: "none",
  dialogAction: (action) =>
    set((state) => {
      if (action.type === "show" || (action.type === "toggle" && action.name !== state.dialogValue)) {
        return { dialogValue: action.name };
      } else {
        return { dialogValue: "none" };
      }
    }),
});
