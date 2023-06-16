"use client";

import { api } from "#src/hooks/trpc";

type Props = {
  className?: string;
};

export function Stuff({ className = "" }: Props) {
  const hmm = api.post.getAll.useQuery();
  return <div className={className}>stufftsx</div>;
}
