import Link from "next/link";
import { buttonVariants } from "#src/components/ui/Button";

const buttonStyles = buttonVariants({ variant: "default" });

export default function NotFound() {
  return (
    <div className="container flex justify-center">
      <div>
        <h2>Nothing here</h2>
        <Link href="/" className={buttonStyles}>
          GO HOME
        </Link>
      </div>
    </div>
  );
}
