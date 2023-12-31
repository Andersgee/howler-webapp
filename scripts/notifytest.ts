import "dotenv/config";

//import { db } from "#src/db";

//put `"type": "module"` in package.json for this to work...

type NotifyBody = {
  userId: number;
  title: string;
  body: string;
  linkUrl: string;
  imageUrl?: string;
};

async function notifyUserId1() {
  const body: NotifyBody = {
    userId: 1,
    title: "yo title here",
    body: "clicking this should link to /event",
    linkUrl: "https://howler.andyfx.net/event",
    //imageUrl: "https://howler.andyfx.net/icons/favicon-48x48.png",
  };
  const data = await fetch(`${process.env.DATABASE_HTTP_URL}/notify`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.DATABASE_HTTP_AUTH_HEADER,
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());
  console.log(data);
}

//createExample();
notifyUserId1();
//debugpost();
