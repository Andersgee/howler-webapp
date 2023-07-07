"use client";

import { IconEdit } from "../Icons";
import { Button } from "../ui/Button";

type Props = {};

export function EditEventButton({}: Props) {
  return (
    <Button>
      <IconEdit clickable />
    </Button>
  );
}
