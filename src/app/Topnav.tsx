import Link from "next/link";
import { IconHowler } from "#src/components/Icons";
import {
  ChatNotificationsButton,
  NotificationsButton,
  ProfileButton,
  SigninButton,
} from "#src/components/TopnavButtons";
import { getUserFromCookie } from "#src/utils/token";

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
            <ChatNotificationsButton user={user} />
            <NotificationsButton user={user} />
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
