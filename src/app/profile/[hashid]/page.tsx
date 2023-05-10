import Image from "next/image";
import { idFromHashid } from "src/utils/hashid";
import { notFound } from "next/navigation";
import { db } from "src/db";

export default async function Page({ params }: { params: { hashid: string } }) {
  const id = idFromHashid(params.hashid);
  if (id === undefined) notFound();

  const user = await db
    .selectFrom("User")
    .select("User.name")
    .select("User.image")
    .where("User.id", "=", id)
    .getFirst({
      next: {
        tags: [`profile/${params.hashid}`],
      },
    });
  if (!user) notFound();

  return (
    <main className="container flex justify-center">
      <div>
        <div className="flex items-center">
          <Image src={user.image || ""} alt={user.name} width={48} height={48} /> <h1 className="ml-2">{user.name}</h1>
        </div>
        <div>public profile</div>
      </div>
    </main>
  );
}
