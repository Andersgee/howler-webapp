import Link from "next/link";

export default async function Page() {
  return (
    <main className="flex justify-center">
      <div className="container bg-orange-400">
        <div>hello</div>
        <Link href="/event" className="px-3 py-2 bg-blue-500">
          go to event
        </Link>
      </div>
    </main>
  );
}
