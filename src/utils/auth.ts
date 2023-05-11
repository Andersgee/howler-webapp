import type { DB } from "src/db/types";
import type { InsertObjectOrList } from "kysely/dist/cjs/parser/insert-values-parser";
import { db } from "src/db";
import { z } from "zod";

export const SESSION_COOKIE_NAME = "__Host-session-csrf";
export const USER_COOKIE_NAME = "__Host-user";

/**
 * should be hardcoded
 *
 * see https://developers.google.com/identity/openid-connect/openid-connect#discovery
 *
 * field names in returned json must comply with: https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata
 *
 * but the only things we care about is `authorization_endpoint` and  `token_endpoint`
 * */
export const GOOGLE_OPENID_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration";

export const GITHUB_AUTHORIZATION_URL = "https://github.com/login/oauth/authorize";
export const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
export const GITHUB_USERINFO_URL = "https://api.github.com/user";
export const GITHUB_EMAILS_URL = "https://api.github.com/user/emails";

export const DISCORD_AUTHORIZATION_URL = "https://discord.com/api/oauth2/authorize";
export const DISCORD_TOKEN_URL = "https://discord.com/api/oauth2/token";
export const DISCORD_USERINFO_URL = "https://discord.com/api/users/@me";

export const GOOGLE_discoveryDocument = z.object({
  authorization_endpoint: z.string(),
  token_endpoint: z.string(),
});

export const GOOGLE_TOKEN = z.object({
  id_token: z.string(),
  access_token: z.string(),
  expires_in: z.number(),
  scope: z.string(),
  token_type: z.string(),
});

export const GOOGLE_USERINFO = z.object({
  sub: z.string(),
  name: z.string(),
  email: z.string(),
  picture: z.string(),
  //iss: string;
  //azp: string;
  //aud: string;
  //email_verified: boolean;
  //at_hash: string;
  //nonce: string;
  //given_name: string;
  //family_name: string;
  //locale: string;
  //iat: number;
  //exp: number;
});

export const GITHUB_TOKEN = z.object({
  access_token: z.string(),
  scope: z.string(),
  token_type: z.string(),
});

//https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-the-authenticated-user
export const GITHUB_USERINFO = z.object({
  id: z.number(),
  login: z.string(),
  name: z.string().nullish(),
  email: z.string().nullish(),
  avatar_url: z.string(),
});

export const GITHUB_EMAILINFO = z
  .array(
    z.object({
      email: z.string(),
      primary: z.boolean(),
      verified: z.boolean(),
      visibility: z.enum(["public", "private"]),
    })
  )
  .min(1);

export const DISCORD_USERINFO = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  avatar: z.string().nullish(),
  discriminator: z.string(),
});

export const DISCORD_TOKEN = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
  scope: z.string(),
});

export async function addUser(user: InsertObjectOrList<DB, "User">) {
  return await db.insertInto("User").values(user).executeTakeFirst();
}

export async function getUserByEmail(email: string) {
  return await db.selectFrom("User").selectAll().where("email", "=", email).executeTakeFirst();
}
