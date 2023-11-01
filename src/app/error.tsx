"use client";

// Error components must be Client components
import { useEffect, useRef, useState } from "react";
import { IconLoadingSpinner } from "#src/components/Icons";
import { MainShell } from "#src/components/MainShell";
import { Button } from "#src/components/ui/Button";
import { api } from "#src/hooks/api";
import { hashidFromId } from "#src/utils/hashid";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const [errorId, setErrorId] = useState("");
  const didReport = useRef(false);
  const errorCreate = api.error.create.useMutation({
    onSuccess: (insertId) => setErrorId(`${hashidFromId(insertId)}-${insertId}`),
  });
  useEffect(() => {
    if (didReport.current) return; //error could change many times, only report first error

    errorCreate.mutate({ name: error.name, message: error.message });
    didReport.current = true;
    // Log the error to an error reporting service
    console.error(error);
  }, [error, errorCreate]);

  return (
    <MainShell>
      <h2>Something went wrong!</h2>
      {errorId ? (
        <div>
          <p>{`a report with id "${errorId}" has been generated to help prevent this in the future.`}</p>
        </div>
      ) : (
        <div>
          <IconLoadingSpinner /> hang on...
        </div>
      )}

      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Click here to reload
      </Button>
    </MainShell>
  );
}
