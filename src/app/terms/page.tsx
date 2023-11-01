//export const runtime = "edge";

import { MainShell } from "#src/components/MainShell";

export default function Page() {
  return (
    <MainShell>
      <h1 className="text-xl">Terms of service</h1>
      <ul>
        <li>Howler is a web app that lets you quickly create and plan events.</li>
        <li>Dont spam/abuse the service or create offensive content.</li>
        <li>
          Misuse of the service in any way deemed inappropriate by the creators may result in removal of your account.
        </li>
      </ul>
    </MainShell>
  );
}
