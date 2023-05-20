import { IconHowler } from "src/icons/Howler";
import { actionCreateEvent } from "./actions";
import { getUserFromCookie } from "src/utils/token";
import { HowlbuttonTriggerSignin } from "./components";

export async function HowlButton() {
  const user = await getUserFromCookie();
  return user ? (
    <button
      formAction={actionCreateEvent}
      type="submit"
      className="flex w-40 items-center justify-center rounded-full border-2 border-black bg-blue-50 px-2 py-2 transition-colors hover:bg-blue-200"
    >
      <span className="mr-2 text-2xl text-black">Howl</span>
      <IconHowler />
    </button>
  ) : (
    <HowlbuttonTriggerSignin />
  );
}
