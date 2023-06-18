"use client";

import { usePathname } from "next/navigation";
import { useToast } from "#src/hooks/use-toast";
import { IconShare } from "#src/icons/Share";
import { absUrl } from "#src/utils/url";
import { Button } from "./ui/Button";

type Props = {
  title: string;
  className?: string;
};

export function ShareButton({ className = "", title }: Props) {
  const pathName = usePathname();
  const { toast } = useToast();
  return (
    <Button
      variant="secondary"
      className={className}
      onClick={async () => {
        const url = absUrl(pathName);
        try {
          if (typeof window !== "undefined" && "share" in navigator) {
            await navigator.share({
              title: title,
              url: url,
            });
          } else {
            //just copy link instead of native sharing not available
            const ok = await copyToClipboard(url);
            if (ok) {
              toast({
                description: "Link copied",
              });
            }
          }
        } catch (error) {
          console.log(error);
        }
      }}
    >
      <IconShare /> Share
    </Button>
  );
}

async function copyToClipboard(text: string) {
  if ("clipboard" in navigator) {
    navigator.clipboard.writeText(text).then(
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
  return false;
}
