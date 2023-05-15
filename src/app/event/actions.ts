"use server";

//import { redirect } from "next/navigation";
import { getUserFromCookie } from "src/utils/token";

import { z } from "zod";

/*
notes to self:

the top level use server directive means all exports in this file will be server actions
https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions

all input and output args must be serializable.. so prob use superjson liberally in this file?
 */

export async function myAction(formData: FormData) {
  console.log("formData:", formData);
  const say = formData.get("say");
  const to = formData.get("to");

  //if (!isValidData) throw new Error('Invalid input.');

  const user = await getUserFromCookie();
  /*
  if (!user) {
    redirect("/profile")
  }
  */
  console.log("user:", user);
  console.log("myAction called");
}
