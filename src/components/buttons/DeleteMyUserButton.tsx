"use client";

import { useRouter } from "next/navigation";
import { ButtonWithConfirmDialog } from "../ButtonWithConfirmDialog";

export function DeleteMyUserButton() {
  const router = useRouter();

  const handleDeleteClick = () => {
    router.push("/api/auth/delete-my-user");
  };

  return (
    <ButtonWithConfirmDialog
      variant="destructive"
      title="Are you absolutely sure?"
      description="This can not be undone! It will delete your account and anything related to it like events and all your chat messages etc."
      actionVariant="destructive"
      actionLabel="Delete"
      cancelLabel="Cancel"
      onActionClick={handleDeleteClick}
    >
      Delete my account
    </ButtonWithConfirmDialog>
  );
}
