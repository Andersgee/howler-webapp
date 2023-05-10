import { db } from "src/db";

export async function SomeExamples() {
  const examples = await db
    .selectFrom("Example")
    .selectAll()
    .get({
      next: { revalidate: 10 },
    });

  return (
    <>
      {examples.map((example) => (
        <div key={example.id}>{example.createdAt.toLocaleString()}</div>
      ))}
    </>
  );
}
