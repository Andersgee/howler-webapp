"use client";

import { api } from "#src/hooks/api";

type Props = {
  className?: string;
};

export function Stuff({ className = "" }: Props) {
  const posts = api.post.getAll.useQuery();
  return <div className={className}>{JSON.stringify(posts.data)}</div>;
}
