import Link from "next/link";
import { MainShell } from "#src/components/MainShell";
import { buttonVariants } from "#src/components/ui/Button";

const buttonStyles = buttonVariants({ variant: "default" });

export default function NotFound() {
  return (
    <MainShell>
      <h2>Nothing here</h2>
      <Link href="/" className={buttonStyles}>
        GO HOME
      </Link>
    </MainShell>
  );
}
