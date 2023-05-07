import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    throw new Error("this error works properly");
    return new Response(undefined, {
      status: 303,
      headers: {
        Location: `http://localhost:3000`,
      },
    });
  } catch (error) {
    console.log(error);
    return new Response(undefined, {
      status: 303,
      headers: {
        Location: `http://localhost:3000/nope`,
      },
    });
  }
}
