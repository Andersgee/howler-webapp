export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type PageProps = {
  params: { hashid: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
