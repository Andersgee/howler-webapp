import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <h2>Not Found</h2>
      <Link href="/" className="bg-blue-500 px-3 py-2 text-lg font-bold text-white">
        GO HOME
      </Link>
    </>
  );
}
