"use client";

type Props = {
  className?: string;
};

export function Somestuff({ className = "" }: Props) {
  return (
    <div className={className}>
      <h2>clientcomponent: /hmm/Somestuff.tsx</h2>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum,
        error.
      </p>
      <button
        onClick={() => console.log("clicked")}
        className="block bg-blue-500 px-3 py-2 font-bold text-white"
      >
        button with onClick
      </button>

      <button
        onClick={() => fetch("api/session")}
        className="bg-purple-500 block px-3 py-2 font-bold text-white"
      >
        button, fetch a session cookie
      </button>

      <button
        onClick={async () => {
          try {
            const res = await fetch("api/auth/signin/google");
            const d = await res.json();
            console.log(d);
          } catch (error) {
            console.log(error);
          }
        }}
        className="bg-green-500 block px-3 py-2 font-bold text-white"
      >
        call /api/signin/google
      </button>

      <a href="api/auth/signin/google" className="block px-3 py-2 bg-lime-500">
        Link to /api/auth/signin/google
      </a>

      <a href="api/welp" className="block px-3 py-2 bg-lime-500">
        Link to /api/welp
      </a>
    </div>
  );
}
