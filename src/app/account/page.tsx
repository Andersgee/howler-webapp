import { notFound } from "next/navigation";
import { SigninButtons } from "#src/components/buttons/SigninButtons";
import { getUserInfo } from "#src/utils/tags";
import { getUserFromCookie } from "#src/utils/token";

export default async function Page() {
  const tokenUser = await getUserFromCookie();
  if (!tokenUser) {
    return (
      <div>
        <h1>Sign in </h1>
        <SigninButtons />
      </div>
    );
  }
  const user = await getUserInfo({ userId: tokenUser.id });
  if (!user) notFound();

  return (
    <div>
      <h1>Account</h1>
      <p>signed in as {tokenUser.name}</p>
      <p>todo</p>
    </div>
  );
}
