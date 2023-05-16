"use server";

import { redirect } from "next/navigation";
import { db } from "src/db";
import { hashidFromId } from "src/utils/hashid";
//import { redirect } from "next/navigation";
import { getUserFromCookie } from "src/utils/token";

//import { z } from "zod";

/*
notes to self:

the top level use server directive means all exports in this file will be server actions
https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions

all input and output args must be serializable.. so prob use superjson liberally in this file?
 */

export async function myAction(formData: FormData) {
  console.log("formData:", formData);
  const user = await getUserFromCookie();

  //there has to be a nicer way to validate this...
  /*
  const what = formData.get("what");
  const where = formData.get("where");
  const when = formData.get("when");
  const who = formData.get("who");
  if (
    !user ||
    !what ||
    !where ||
    !when ||
    !who ||
    typeof what !== "string" ||
    typeof where !== "string" ||
    typeof when !== "string" ||
    typeof who !== "string"
  ) {
    console.log("invalid");
    return null;
  }

  const insertresult = await db
    .insertInto("Event")
    .values({
      creatorId: user.id,
      what: what,
      where: where,
      when: new Date(),
      who: who,
      info: "",
    })
    .executeTakeFirst();

  console.log("insertresult", insertresult);
  const insertId = Number(insertresult.insertId);
  const hashid = hashidFromId(insertId);

  redirect(`/event/${hashid}`);
  //console.log("insertId", insertId);
  */
}
