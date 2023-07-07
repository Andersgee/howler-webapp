/** simulate slow db call */
export async function artificialDelay(ms = 2000) {
  if (process.env.NODE_ENV === "development") {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
