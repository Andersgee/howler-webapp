import { myAction } from "./actions";

export default function Page() {
  return (
    <div>
      <h1>create event</h1>
      <p>Lorem ipsum dolor sit amet consectetur.</p>
      <form action={myAction}>
        <div>
          <label className="mr-2" htmlFor="what">
            What
          </label>
          <input name="what" id="what" defaultValue="" />
        </div>

        <div>
          <label className="mr-2" htmlFor="where">
            Where
          </label>
          <input name="where" id="where" defaultValue="" />
        </div>

        <div>
          <label className="mr-2" htmlFor="when">
            When
          </label>
          <input name="when" id="when" defaultValue="" />
        </div>

        <div>
          <label className="mr-2" htmlFor="who">
            Who
          </label>
          <input name="who" id="who" defaultValue="" />
        </div>

        <button type="submit" className="bg-blue-500 px-3 py-2 font-bold text-white">
          button with server action
        </button>
      </form>
    </div>
  );
}
