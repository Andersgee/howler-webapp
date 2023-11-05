import { ActivateNotificationsButton } from "#src/components/buttons/ActivateNotificationsButton";
import { CreateEventForm } from "#src/components/CreateEventForm";
import { ExploreMap } from "#src/components/ExploreMap";
import { MainShellFull } from "#src/components/MainShell";
import { seo } from "#src/utils/seo";

export const metadata = seo({
  title: "Howler",
  description:
    "Looking for something to do in real life? A place to quickly find/plan stuff to do with friends, or with anyone really.",
  url: "/",
  image: "/howler.png",
});

export default function Page() {
  return (
    <MainShellFull>
      <ExploreMap className="py-2" />
      <CreateEventForm />
      <ActivateNotificationsButton />
    </MainShellFull>
  );
}
