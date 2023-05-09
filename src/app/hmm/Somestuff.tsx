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
    </div>
  );
}
