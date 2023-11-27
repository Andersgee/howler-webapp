import { notFound } from "next/navigation";
import { apiRsc } from "#src/api/apiRsc";
import { DeleteMyUserButton } from "#src/components/buttons/DeleteMyUserButton";
import { UserImage } from "#src/components/UserImage";

export default async function Page() {
  const { api, user } = await apiRsc();
  if (!user) {
    return (
      <div>
        <h1>Not signed in</h1>
      </div>
    );
  }
  const userInfo = await api.user.info.fetch({ userId: user.id });
  if (!userInfo) notFound();

  return (
    <div>
      <h1>Account</h1>
      <div>signed in as {userInfo.name}</div>
      <div>your account:</div>
      <ul>
        <li>name: {userInfo.name}</li>
        <li>email: {userInfo.email}</li>
        <li className="flex items-center">
          image: <UserImage alt={userInfo.name} src={userInfo.image || ""} />
        </li>
      </ul>
      <hr />
      <h2 className="mt-14">DANGER ZONE</h2>
      <p>
        You can delete your account and everything you created like events, chat messages etc. by clicking this button
      </p>
      <DeleteMyUserButton />
    </div>
  );
}
