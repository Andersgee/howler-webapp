import { getUserFromCookie } from "src/utils/token";

export function RSCUserprofile() {
  const user = getUserFromCookie();

  return (
    <div className="bg-orange-300">
      <h2>This is a server component</h2>
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
