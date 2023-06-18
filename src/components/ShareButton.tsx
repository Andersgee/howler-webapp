"use client";

import { usePathname } from "next/navigation";
import { absUrl } from "#src/utils/url";
import { Button } from "./ui/Button";

type Props = {
  title: string;
  className?: string;
};

export function ShareButton({ className = "", title }: Props) {
  const pathName = usePathname();
  return (
    <Button
      variant="secondary"
      className={className}
      onClick={async () => {
        try {
          if (typeof window !== "undefined" && "share" in navigator) {
            await navigator.share({
              title: title,
              url: absUrl(pathName),
            });
          } else {
            console.log("native sharing not supported in your browser, prob show a 'copy link' button instead ");
          }
        } catch (error) {
          console.log(error);
        }
      }}
    >
      Share
    </Button>
  );
}
