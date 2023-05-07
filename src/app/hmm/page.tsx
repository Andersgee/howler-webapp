import { myAction } from "../_actions";
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
    </div>
  );
}
