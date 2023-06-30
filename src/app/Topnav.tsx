import Link from "next/link";
import { IconHowler } from "#src/components/Icons";
import { ProfileButton, SigninButton } from "#src/components/TopnavButtons";
import { getUserFromCookie } from "#src/utils/token";
import { Notifications } from "./Notifications";

export async function Topnav() {
  const user = await getUserFromCookie();
  return (
    <div className="container">
      <div className="flex justify-between">
        <Link href="/">
          <IconHowler clickable />
        </Link>
        {user ? (
          <div className="flex">
            <Notifications user={user} />
            <ProfileButton user={user} />
          </div>
        ) : (
          <div>
            <SigninButton />
          </div>
        )}
      </div>
    </div>
  );
}
