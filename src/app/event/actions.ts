"use server";

/*
notes to self:

the top level use server directive means all exports in this file will be server actions
https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions

all input and output args must be serializable.. so prob use superjson liberally in this file?
 */

export async function myAction() {
  console.log("myAction called");
}
