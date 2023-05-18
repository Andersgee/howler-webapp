"use server";

import { addMinutes } from "date-fns";
import { redirect } from "next/navigation";
import { db } from "src/db";
import { hashidFromId } from "src/utils/hashid";
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

/** utility, validate and parse formdata into `Record<string,string>` (with typed keys) */
function validateFormData<T extends string>(formData: FormData, names: T[]): Record<T, string> | null {
  const r: Record<string, string> = {};
  for (const name of names) {
    const val = formData.get(name);
    if (typeof val === "string") {
      r[name] = val;
    } else {
      return null;
    }
  }
  return r;
}

function int(s: string) {
  const x = parseInt(s, 10);
  return isFinite(x) ? x : null;
}

export async function actionCreateEvent(formData: FormData) {
  const user = await getUserFromCookie();
  if (!user) {
    console.log("no user");
    return null;
  }

  const data = validateFormData(formData, ["what", "where", "when", "whenend", "who", "tzminuteoffset"]);
  if (!data) {
    console.log("no data");
    return null;
  }

  const offset = int(data.tzminuteoffset);
  if (!offset) {
    console.log("no tz offset");
    return null;
  }

  const whenDate = localIsoStringToDate(data.when, offset);
  const whenendDate = localIsoStringToDate(data.whenend, offset);

  const insertresult = await db
    .insertInto("Event")
    .values({
      creatorId: user.id,
      what: data.what,
      where: data.where,
      when: whenDate,
      whenEnd: whenendDate,
      who: data.who,
      info: "",
    })
    .executeTakeFirst();

  console.log("insertresult", insertresult);
  const insertId = Number(insertresult.insertId);
  const hashid = hashidFromId(insertId);

  redirect(`/event/${hashid}`);
  //console.log("insertId", insertId);
}
