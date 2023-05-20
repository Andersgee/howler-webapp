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
    if (!parsedFormData.success) {
      console.log(parsedFormData.error);
      return null;
    }
    if (!user) {
      console.log("no user");
      return null;
    }

    const data = parsedFormData.data;

    return action({ data, user });
  };
}
