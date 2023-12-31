"use client";

import { usePathname } from "next/navigation";
import { toast } from "#src/hooks/use-toast";
import { cn } from "#src/utils/cn";
import { absUrl } from "#src/utils/url";
import { IconShare } from "../Icons";
import { Button } from "../ui/Button";

type Props = {
  title: string;
  className?: string;
};

export function ShareButton({ className, title }: Props) {
  const pathName = usePathname();
  return (
    <Button
      variant="secondary"
      className={cn("font-semibold", className)}
      onClick={async () => {
        const url = absUrl(pathName);
        try {
          if (typeof window !== "undefined" && "share" in navigator) {
            await navigator.share({
              title: title,
              url: url,
            });
          } else {
            //just copy link if native sharing not available
            const ok = await copyToClipboard(url);
            if (ok) {
              toast({
                description: "Link copied",
              });
            }
          }
        } catch (error) {
          //toast({
          //  variant: "destructive",
          //  description: errorMessageFromUnkown(error)
          //})
          //console.error(errorMessageFromUnkown(error));
        }
      }}
    >
      <IconShare /> <span className="ml-2">Share</span>
    </Button>
  );
}

async function copyToClipboard(text: string) {
  if (!("clipboard" in navigator)) return false;

  return navigator.clipboard.writeText(text).then(
    () => {
      /* clipboard successfully set */
      return true;
    },
    () => {
      /* clipboard write failed */
      return false;
    }
  );
}
