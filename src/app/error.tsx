"use client";

// Error components must be Client components
import { useEffect } from "react";
import { MainShell } from "#src/components/MainShell";
import { Button } from "#src/components/ui/Button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <MainShell>
      <h2>Something went wrong!</h2>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </MainShell>
  );
}
