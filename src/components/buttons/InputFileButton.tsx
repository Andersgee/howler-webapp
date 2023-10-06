"use client";

import { cn } from "#src/utils/cn";

type Props = {
  className?: string;
  children: React.ReactNode;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

/** wrapper for `<input type="file" />`  */
export function InputFileButton({ className, children, ...props }: Props) {
  return (
    <label className={cn("block cursor-pointer", className)}>
      <input type="file" className="sr-only" {...props} />
      {children}
    </label>
  );
}
