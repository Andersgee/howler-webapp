import Link from "next/link";
import { MainShell } from "#src/components/MainShell";

type Props = {
  children: React.ReactNode;
  /** adjust params according dynamic routes, eg if this is under a [slug] folder */
  //params: { slug: string };
};

export default function Layout({ children }: Props) {
  return (
    <MainShell>
      <div className="flex gap-4">
        <div className="shrink-0 border-r pr-4">
          <h1>Settings</h1>
          <div className="">
            <Link href="/account" className="block px-3 py-2 ">
              Account
            </Link>
            <Link href="/account/notifications" className="block px-3 py-2 ">
              Notifications
            </Link>
          </div>
        </div>
        <div className="flex grow justify-center">{children}</div>
      </div>
    </MainShell>
  );
}
