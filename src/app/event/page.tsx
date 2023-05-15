import { myAction } from "./actions";

export default function Page() {
  return (
    <div>
      <h1>create event</h1>
      <p>Lorem ipsum dolor sit amet consectetur.</p>
      <form action={myAction}>
        <div>
          <label htmlFor="say">What greeting do you want to say?</label>
          <input name="say" id="say" value="Hi" />
        </div>
        <div>
          <label htmlFor="to">Who do you want to say it to?</label>
          <input name="to" id="to" value="Mom" />
        </div>
        <button type="submit" className="bg-blue-500 px-3 py-2 font-bold text-white">
          button with server action
        </button>
      </form>
    </div>
  );
}
