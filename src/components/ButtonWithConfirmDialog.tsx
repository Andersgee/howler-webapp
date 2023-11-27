"use client";

import { type VariantProps } from "class-variance-authority";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "#src/components/ui/AlertDialog";
import { Button, type buttonVariants } from "#src/components/ui/Button";

type Props = {
  //className?: string;
  onActionClick: () => void;
  /** example: Are you absolutely sure? */
  title: string;
  /** example: This action cannot be undone. */
  description: string;
  cancelLabel: string;
  actionLabel: string;
  actionVariant: VariantProps<typeof buttonVariants>["variant"];
} & VariantProps<typeof buttonVariants> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export function ButtonWithConfirmDialog({
  title,
  description,
  actionLabel,
  actionVariant,
  cancelLabel,
  onActionClick,
  ...props
}: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button {...props} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction variant={actionVariant} onClick={() => onActionClick()}>
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
