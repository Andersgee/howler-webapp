"use client";

import { createContext, useContext, useReducer } from "react";

import type { Prettify } from "#src/utils/typescript";

export function useDialogContext() {
  const ctx = useContext(DialogContext);
  if (ctx === undefined) throw new Error("context does not have provider");
  return ctx;
}

export function useDialogDispatch() {
  const ctx = useContext(DialogDispatch);
  if (ctx === undefined) throw new Error("context does not have provider");
  return ctx;
}

/////////////////////////////////////////////////

const initialState = "none";

const DialogContext = createContext<undefined | Value>(undefined);
const DialogDispatch = createContext<undefined | React.Dispatch<Action>>(undefined);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [value, dispatch] = useReducer(reducer, initialState);

  return (
    <DialogContext.Provider value={value}>
      <DialogDispatch.Provider value={dispatch}>{children}</DialogDispatch.Provider>
    </DialogContext.Provider>
  );
}

//probably overkill to use reducer here but...

type Type = "show" | "hide" | "toggle";
type Name = "signin" | "warning";
type Value = Prettify<"none" | Name>;
type Action = { type: Type; name: Name };

function reducer(value: Value, action: Action): Value {
  const t = action.type;
  if (t === "show" || (t === "toggle" && value === "none")) {
    return action.name;
  }
  return "none";
}
