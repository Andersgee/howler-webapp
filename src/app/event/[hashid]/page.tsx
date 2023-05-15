import { db } from "src/db";
import { notFound } from "next/navigation";
import { idFromHashid } from "src/utils/hashid";
import { getEvent } from "./data";

export default async function Page({ params }: { params: { hashid: string } }) {
  const event = await getEvent(params.hashid);
  if (!event) notFound();

  return (
    <main className="container">
      <div>
        <h1>example:</h1>
        <pre>{JSON.stringify(event, null, 2)}</pre>
      </div>
    </main>
  );
}
