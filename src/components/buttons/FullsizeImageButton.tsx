"use client";

import Image from "next/image";
import {
  Dialog,
  //DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FullsizeDialogContent,
} from "#src/components/ui/Dialog";

type Props = {
  children: React.ReactNode;
  title: string;
  src: string;
  alt: string;
};

export function FullsizeImageButton({ children, title, src, alt }: Props) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <FullsizeDialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="relative h-full w-full">
          <Image alt={alt} src={src} fill quality={100} sizes="100vw" className="object-contain" />
        </div>
      </FullsizeDialogContent>
    </Dialog>
  );
}
