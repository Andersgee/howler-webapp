"use client";

import { api } from "#src/hooks/api";

type Props = {
  className?: string;
};

export function Stuff({ className = "" }: Props) {
  const posts = api.post.getAll.useQuery();
  const hmm = api.post.protectedGetLatestExample.useQuery();

  return (
    <div className={className}>
      <h2>trpc api Stuff</h2>
      <div>posts via api.post.getAll.useQuery() </div>
      <div>posts.data: {JSON.stringify(posts.data)}</div>
      <div>hmm.data: {JSON.stringify(hmm.data)}</div>
      {posts.data ? posts.data.fetchedAt.toISOString() : "no post"}
    </div>
  );
}
