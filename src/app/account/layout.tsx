import Link from "next/link";

type Props = {
  children: React.ReactNode;
  /** adjust params according dynamic routes, eg if this is under a [slug] folder */
  //params: { slug: string };
};

export default function Layout({ children }: Props) {
  return (
    <div className="container">
      <div className="flex gap-4">
        <div>
          <h1>Settings</h1>
          <div className="">
            <Link href="/account" className="block">
              Account
            </Link>
            <Link href="/account/notifications" className="block">
              Notifications
            </Link>
          </div>
        </div>
        <div className="flex grow justify-center">{children}</div>
      </div>
    </div>
  );
}
