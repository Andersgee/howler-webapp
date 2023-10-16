import { create } from "zustand";
import { createDialogSlice, type DialogSlice } from "./slices/dialog";
import { createFcmSlice, type FcmSlice } from "./slices/fcm";
import { createMapSlice, type MapSlice } from "./slices/map";
import { createUserSlice, type Userlice } from "./slices/user";
import { createSelectors } from "./utils";

type StoreState = DialogSlice & MapSlice & Userlice & FcmSlice;

const useStoreBase = create<StoreState>()((...a) => ({
  ...createDialogSlice(...a),
  ...createMapSlice(...a),
  ...createUserSlice(...a),
  ...createFcmSlice(...a),
}));

export const useStore = createSelectors(useStoreBase);
