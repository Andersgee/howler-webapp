import type { z } from "zod";
import { getUserFromCookie } from "./token";
import type { TokenUser } from "./token/schema";

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
    if (!parsedFormData.success) {
      console.warn(parsedFormData.error);
      return null;
    }
    if (!user) {
      return null;
    }

    const data = parsedFormData.data;

    return action({ data, user });
  };
}
