import Link from "next/link";
import { MainShell } from "#src/components/MainShell";
import { buttonStylesDefault } from "#src/components/ui/Button";

export default function NotFound() {
  return (
    <MainShell>
      <h2>Nothing here</h2>
      <Link href="/" className={buttonStylesDefault}>
        GO HOME
      </Link>
    </MainShell>
  );
}
