import { myAction } from "../_actions";

export default function Page() {
  return (
    <form action={myAction}>
      <button type="submit" className="bg-green-400 px-3 py-2">
        perform server action
      </button>
    </form>
  );
}
