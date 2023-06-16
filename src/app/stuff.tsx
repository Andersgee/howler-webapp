"use client";

import { api } from "#src/hooks/api";

type Props = {
  className?: string;
};

export function Stuff({ className = "" }: Props) {
  const posts = api.post.getAll.useQuery();
  return (
    <div>
      <div>posts via api.post.getAll.useQuery() </div>
      <div className={className}>{JSON.stringify(posts.data)}</div>
    </div>
  );
}
