import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <h2>Not Found</h2>
      <Link href="/" className="px-3 py-2 bg-blue-500 text-white font-bold text-lg">
        GO HOME
      </Link>
    </>
  );
}
