import { cookies } from "next/headers";
import { type NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { type TokenUser, TokenUserSchema } from "./token-user";
import { USER_COOKIE_NAME } from "./constants";

export function getUserFromToken(token: string | undefined) {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
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
export function getUserFromRequestCookie(req: NextRequest) {
  const token = req.cookies.get(USER_COOKIE_NAME)?.value;
  return getUserFromToken(token);
}

/**
 * for server component files
 *
 * use this in server component page.tsx files
 */
export function getUserFromCookie() {
  const token = cookies().get(USER_COOKIE_NAME)?.value;
  return getUserFromToken(token);
}

/**
 * return a signed jwt from `TokenUser` object
 */
export function createTokenFromUser(user: TokenUser) {
  return jwt.sign(user, process.env.JWT_SECRET); //without expiry
}
