import { NotificationsButton } from "#src/components/TopnavButtons";
import type { TokenUser } from "#src/utils/token/schema";

type Props = {
  user: TokenUser;
};

export async function Notifications({ user }: Props) {
  return <NotificationsButton initialMessages={[]} />;
}
