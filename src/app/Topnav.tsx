import { apiRsc } from "#src/api/apiRsc";
import { HomeButton } from "#src/components/HomeButton";
import {
  ChatNotificationsButton,
  NotificationsButton,
  ProfileButton,
  SigninButton,
} from "#src/components/TopnavButtons";

export async function Topnav() {
  const { user } = await apiRsc();
  return (
    <nav className="container">
      <div className="flex justify-between">
        <HomeButton />

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
    </nav>
  );
}
