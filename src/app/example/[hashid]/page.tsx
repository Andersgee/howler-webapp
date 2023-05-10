import { db } from "src/db";
import { notFound } from "next/navigation";
import { idFromHashid } from "src/utils/hashid";

export default async function Page({ params }: { params: { hashid: string } }) {
  const id = idFromHashid(params.hashid);
  if (id === undefined) notFound();

  const example = await db
    .selectFrom("Example")
    .selectAll()
    .where("Example.id", "=", id)
    .getFirst({
      next: {
        revalidate: 10,
      },
    });
  if (!example) notFound();

  return (
    <main className="container">
      <div>
        <h1>example:</h1>
        <pre>{JSON.stringify(example, null, 2)}</pre>
      </div>
    </main>
  );
}
