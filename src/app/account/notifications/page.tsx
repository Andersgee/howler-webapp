import { notFound } from "next/navigation";
import { apiRsc } from "#src/api/apiRsc";
import { SigninButtons } from "#src/components/buttons/SigninButtons";

//export const dynamic = "force-dynamic";

export default async function Page() {
  const { api, user } = await apiRsc();
  if (!user) {
    return (
      <div>
        <h1>Sign in </h1>
        <SigninButtons />
      </div>
    );
  }
  const userInfo = await api.user.info.fetch({ userId: user.id });
  if (!userInfo) notFound();

  return (
    <div>
      <h1>Choose when and how to be notified, coming soon</h1>
    </div>
  );
}
