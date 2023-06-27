import Link from "next/link";

type Props = {
  children: React.ReactNode;
  /** adjust params according dynamic routes, eg if this is under a [slug] folder */
  //params: { slug: string };
};

export default function Layout({ children }: Props) {
  return (
    <div className="">
      <h1>account settings</h1>
      <div className="">
        <Link href="/account">account</Link>
        <Link href="/account/notifications">notifications</Link>
      </div>
      {children}
    </div>
  );
}
