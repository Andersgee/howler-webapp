export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type PageProps = {
  params: { hashid: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
