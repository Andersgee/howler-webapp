import { myAction } from "./actions";

export function Page() {
  return (
    <div>
      <h1>create event</h1>
      <p>Lorem ipsum dolor sit amet consectetur.</p>
      <form action={myAction}>
        <button type="submit" className="bg-blue-500 px-3 py-2 font-bold text-white">
          button with server action
        </button>
      </form>
    </div>
  );
}
