"use client";

import Image from "next/image";
import Link from "next/link";
import { api } from "#src/hooks/api";
import { cn } from "#src/utils/cn";
import { hashidFromId } from "#src/utils/hashid";

type Props = {
  userId: number;
  className?: string;
};

export function UserImageFromId({ userId, className }: Props) {
  const { data: user } = api.user.infoPublic.useQuery({ userId });

  return (
    <Image
      src={user?.image || ""}
      alt={user?.image || ""}
      width={30}
      height={30}
      sizes="30px"
      className={cn("shadow-imageborder h-8 w-8 rounded-full p-[1px]", className)}
    />
  );
}

export function UserImageFromIdClickable({ userId }: Props) {
  return (
    <div className="hover:bg-secondary flex h-12 w-12 items-center justify-center rounded-full">
      <UserImageFromId userId={userId} />
    </div>
  );
}

export function LinkUserImageFromId({ userId }: Props) {
  return (
    <Link href={`/u/${hashidFromId(userId)}`}>
      <UserImageFromIdClickable userId={userId} />
    </Link>
  );
}
