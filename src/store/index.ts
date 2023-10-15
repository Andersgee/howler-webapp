import { create } from "zustand";
import { createBearSlice, type BearSlice } from "./slices/bear";
import { createDialogSlice, type DialogSlice } from "./slices/dialog";
import { createFcmSlice, type FcmSlice } from "./slices/fcm";
import { createFishSlice, type FishSlice } from "./slices/fish";
import { createMapSlice, type MapSlice } from "./slices/map";
import { createUserSlice, type Userlice } from "./slices/user";
import { createSelectors } from "./utils";

type StoreState = BearSlice & FishSlice & DialogSlice & MapSlice & Userlice & FcmSlice;

const useStoreBase = create<StoreState>()((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
  ...createDialogSlice(...a),
  ...createMapSlice(...a),
  ...createUserSlice(...a),
  ...createFcmSlice(...a),
}));

export const useStore = createSelectors(useStoreBase);
