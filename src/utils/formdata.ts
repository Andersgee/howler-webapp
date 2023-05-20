import type { z } from "zod";
import type { TokenUser } from "./token/schema";
import { getUserFromCookie } from "./token";

/**
 * validates that formData matches schema, also adds `user` as argument to action call
 */
export function protectedAction<T extends z.ZodTypeAny>(
  schema: T,
  action: ({ data, user }: { data: z.infer<T>; user: TokenUser }) => Promise<null | undefined | void>
) {
  return async (formData: FormData) => {
    const user = await getUserFromCookie();
    const parsedFormData = schema.safeParse(Object.fromEntries(formData));
    if (!parsedFormData.success || !user) {
      throw new Error("Invalid input.");
    }
    const data = parsedFormData.data;

    return action({ data, user });
  };
}

/**
 * @deprecated
 * utility, validate and parse formdata into `Record<string,string>` (with typed keys)
 */
export function validateFormData<T extends string>(formData: FormData, names: T[]): Record<T, string> | null {
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
