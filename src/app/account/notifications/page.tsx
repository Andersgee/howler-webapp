import { notFound } from "next/navigation";
import { SigninButtons } from "#src/components/SigninButtons";
import { Separator } from "#src/components/ui/Separator";
import { getUserInfo } from "#src/utils/tags";
import { getUserFromCookie } from "#src/utils/token";

export const dynamic = "force-dynamic";

export default async function Page() {
  const tokenUser = await getUserFromCookie();
  if (!tokenUser) {
    return (
      <div className="container">
        <div className="flex flex-col items-center">
          <h1>Choose when and how to be notified</h1>
          <Separator />
          <SigninButtons />
        </div>
      </div>
    );
  }
  const user = await getUserInfo({ userId: tokenUser.id });
  if (!user) notFound();

  return (
    <div className="container">
      <div className="flex flex-col items-center">
        <h1>Choose when and how to be notified</h1>
        <p>todo</p>
      </div>
    </div>
  );
}
