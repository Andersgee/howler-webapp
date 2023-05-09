import Link from "next/link";
import { Somestuff } from "./Somestuff";
import { Thingy } from "./Thingy";

export default function Page() {
  return (
    <div className="bg-orange-400 p-2">
      <h2>page: /hmm/page.tsx</h2>
      <div className="m-2">
        <Thingy className="bg-red-300 p-2" />
        <Somestuff className="bg-slate-400 p-2" />
      </div>

      {/* putting prefetch false in server component works (also, it does not even prefetch on hover) */}
      <Link href="/" prefetch={false} className="block px-3 py-2 bg-blue-300">
        GO TO HOME
      </Link>
    </div>
  );
}
