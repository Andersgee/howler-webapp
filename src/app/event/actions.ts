"use server";

import { redirect } from "next/navigation";
import { db } from "src/db";
import { utcDateFromDatetimelocalString } from "src/utils/date";
import { protectedAction } from "src/utils/formdata";
import { hashidFromId } from "src/utils/hashid";
import { z } from "zod";

const schema = z.object({
  what: z.string(),
  where: z.string(),
  when: z.string(),
  whenend: z.string(),
  who: z.string(),
  tzminuteoffset: z.coerce.number(),
});

export const actionCreateEvent = protectedAction(schema, async ({ data, user }) => {
  const whenDate = utcDateFromDatetimelocalString(data.when, data.tzminuteoffset);
  const whenendDate = utcDateFromDatetimelocalString(data.whenend, data.tzminuteoffset);

  const insertresult = await db
    .insertInto("Event")
    .values({
      creatorId: user.id,
      what: data.what,
      where: data.where,
      when: whenDate,
      whenEnd: whenendDate,
      who: data.who,
      info: "no additional info added",
    })
    .executeTakeFirst();

  console.log("insertresult", insertresult);
  const insertId = Number(insertresult.insertId);
  const hashid = hashidFromId(insertId);

  redirect(`/event/${hashid}`);
});
