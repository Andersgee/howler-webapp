"use client";

import { buttonStylesDestructive as buttonStyles } from "../ui/Button";

export function DeleteMyUserButton() {
  return (
    <a href="/api/auth/delete-my-user" className={buttonStyles}>
      Delete my account
    </a>
  );
}
