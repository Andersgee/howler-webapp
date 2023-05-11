import { cookies } from "next/headers";
import { type NextRequest } from "next/server";
import { type TokenUser, TokenUserSchema } from "./token-user";
import { USER_COOKIE_NAME } from "./constants";
import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function getUserFromToken(token: string | undefined) {
  if (!token) return null;
  try {
    //const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { payload, protectedHeader } = await jwtVerify(token, SECRET);

    const user = TokenUserSchema.parse(payload);
    return user;
  } catch (error) {
    return null;
  }
}

/**
 * for route.ts files.
 *
 * make sure the routes are `export const dynamic = "force-dynamic";`.
 */
export async function getUserFromRequestCookie(req: NextRequest) {
  const token = req.cookies.get(USER_COOKIE_NAME)?.value;
  return getUserFromToken(token);
}

/**
 * for server component files
 *
 * use this in server component page.tsx files
 */
export async function getUserFromCookie() {
  const token = cookies().get(USER_COOKIE_NAME)?.value;
  return getUserFromToken(token);
}

/**
 * return a signed jwt from `TokenUser` object
 */
export async function createTokenFromUser(user: TokenUser) {
  const jwt = await new SignJWT(user).setProtectedHeader({ alg: "HS256" }).sign(SECRET);

  return jwt;
  //return jwt.sign(user, process.env.JWT_SECRET); //without expiry
}
