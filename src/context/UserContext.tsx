"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { TokenUser } from "src/utils/token-user";

const Context = createContext<TokenUser | null>(null);

export function useUser() {
  const ctx = useContext(Context);
  if (ctx === undefined) throw new Error("context does not have provider");
  return ctx;
}

async function getSession() {
  const res = await fetch("/api/session");
  if (res.status === 200) {
    const user = (await res.json()) as TokenUser;
    return user;
  }
  return null;
}

/**
 * grab a session, which will return a user instead if in fact user is already signed in,
 * if so, put that user in state for use in client components
 *
 * the user in this state is only for basic ui elements purposes, it only has id,name and image
 */
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<TokenUser | null>(null);
  useEffect(() => {
    getSession()
      .then((user) => {
        if (user) {
          setValue(user);
        }
      })
      .catch((err) => {
        //ignore
      });
  }, []);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
