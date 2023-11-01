"use client";

import { useEffect } from "react";
import { useStore } from "#src/store";
import { TokenUserSchema } from "#src/utils/token/schema";

/**
 * grab a session, if user already signed in then return user instead
 *
 * the user in this state is only for basic ui elements purposes like id, name and image
 */
async function getSession() {
  try {
    const res = await fetch("/api/session");
    if (res.status === 200) {
      const user = TokenUserSchema.parse(await res.json());
      return user;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function useSession() {
  const setUser = useStore.use.setUser();

  useEffect(() => {
    getSession().then((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, [setUser]);

  return null;
}
