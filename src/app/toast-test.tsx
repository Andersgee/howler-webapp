"use client";

import { ToastAction } from "#src/components/ui/Toast";
import { useToast } from "#src/hooks/use-toast";

//import { ToastAction } from "@/components/ui/toast"
//import { useToast } from "@/components/ui/use-toast"

export function ToastWithAction() {
  const { toast } = useToast();

  return (
    <button
      onClick={() => {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }}
    >
      Show Toast
    </button>
  );
}
