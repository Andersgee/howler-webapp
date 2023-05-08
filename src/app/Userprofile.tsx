"use client";

import { useUser } from "src/context/UserContext";

export function Userprofile() {
  const user = useUser();

  return (
    <div className="bg-purple-300">
      <h2>This is a client component</h2>
      {user ? (
        <div>
          <h2>signed in as {user.name}</h2>
          <a href="/api/auth/signout" className="block px-3 py-2 bg-red-400">
            SIGN OUT
          </a>
        </div>
      ) : (
        <div>
          <h2>not signed in</h2>
          <a
            href="/api/auth/signin/google"
            className="block px-3 py-2 bg-green-400"
          >
            SIGN IN WITH GOOGLE
          </a>
        </div>
      )}
    </div>
  );
}
