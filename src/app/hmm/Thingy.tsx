import { myAction } from "../_actions";

type Props = {
  className?: string;
};

export function Thingy({ className = "" }: Props) {
  return (
    <div className={className}>
      <h2>servercomponent: /hmm/Thingy.tsx</h2>
      <p>Lorem ipsum dolor sit amet consectetur.</p>
      <form action={myAction}>
        <button
          type="submit"
          className="bg-blue-500 px-3 py-2 font-bold text-white"
        >
          button with server action
        </button>
      </form>
    </div>
  );
}
