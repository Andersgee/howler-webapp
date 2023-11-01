import type { StoreApi, UseBoundStore } from "zustand";

type WithSelectors<S> = S extends { getState: () => infer T } ? S & { use: { [K in keyof T]: () => T[K] } } : never;

/**
 * adds convenience usage
 *
 * ```js
 * const stuff = useStore.select.stuff()
 * ```
 *
 * instead of
 *
 * ```
 * const stuff = useStore(state => state.stuff)
 * ```
 */
export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  let store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }
  return store;
};
