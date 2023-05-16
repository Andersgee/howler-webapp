"use server";

import { addMinutes, subMinutes } from "date-fns";
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

/**
 * note to self:
 * the datetime-local string we get from form is in the users local time (without any timezone info)
 * we send the users timeone offset aswell to be able to determine what universal datetime it actually is
 */
function localIsoStringToDate(localIsoStringDate: string, tzminuteoffset: number) {
  const d = new Date(localIsoStringDate);
  const utcDate = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()));

  return addMinutes(utcDate, tzminuteoffset);
}

export async function myAction(formData: FormData) {
  console.log("formData:", formData);

  const user = await getUserFromCookie();

  //there has to be a nicer way to validate this...
  const what = formData.get("what");
  const where = formData.get("where");
  const when = formData.get("when");
  const whenend = formData.get("whenend");
  const who = formData.get("who");
  const tzminuteoffset = formData.get("tzminuteoffset");

  if (
    typeof what !== "string" ||
    typeof where !== "string" ||
    typeof when !== "string" ||
    typeof who !== "string" ||
    typeof whenend !== "string" ||
    typeof tzminuteoffset !== "string"
  ) {
    console.log("invalid");
    return null;
  }
  // note to self:

  // -120 for sweden in summertime, new york would be +240 or something
  const offset = parseInt(tzminuteoffset, 10);

  const whenDate = localIsoStringToDate(when, offset);
  const whenDateto = localIsoStringToDate(whenend, offset);
  console.log({ whenDate, whenDateto });

  console.log({
    when_string: new Date(when).toString(),
    when_sring_new: whenDate.toString(),
  });

  /*
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
