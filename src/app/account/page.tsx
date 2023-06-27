import { Separator } from "@radix-ui/react-separator";
import { notFound } from "next/navigation";
import { SigninButtons } from "#src/components/SigninButtons";
import { getUserInfo } from "#src/utils/tags";
import { getUserFromCookie } from "#src/utils/token";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
  /** adjust params according dynamic routes, eg if this is under a [slug] folder */
  //params: { slug: string };
};

export default async function Page(props: Props) {
  const tokenUser = await getUserFromCookie();
  if (!tokenUser) {
    return (
      <div className="container">
        <div className="flex flex-col items-center">
          <h1>Account</h1>
          <Separator />
          <SigninButtons />
        </div>
      </div>
    );
  }
  const user = await getUserInfo({ userId: tokenUser.id });
  if (!user) notFound();

  return (
    <div className="container flex justify-center">
      <div className="flex flex-col items-center">
        <h1>Account</h1>
        <p>signed in as {tokenUser.name}</p>
        <p>todo</p>
      </div>
    </div>
  );
}
