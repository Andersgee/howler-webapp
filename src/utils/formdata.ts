/** utility, validate and parse formdata into `Record<string,string>` (with typed keys) */
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
