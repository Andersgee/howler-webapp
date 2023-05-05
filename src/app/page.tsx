import Link from "next/link";

export default function Home() {
  const someEnvVar = process.env.NEXT_PUBLIC_HELLO;
  return (
    <main className="flex justify-center">
      <div>
        <div className="">
          <div>someEnvVar: {someEnvVar}</div>
          <Link href="/hmm" className="block px-3 py-2 bg-blue-300">
            GO TO HMM
          </Link>
        </div>
      </div>
    </main>
  );
}
