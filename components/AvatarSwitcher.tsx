"use client";

import { useState } from "react";
import Image from "next/image";

export function AvatarSwitcher({
  avatars,
  name,
}: {
  avatars: string[];
  name: string;
}) {
  const [avatarIndex, setAvatarIndex] = useState(0);
  const list = avatars.length > 0 ? avatars : ["/avatars/avatar-default.png"];
  const avatarSrc = list[avatarIndex % list.length];

  function switchAvatar() {
    setAvatarIndex((index) => (index + 1) % list.length);
  }

  return (
    <button
      type="button"
      onClick={switchAvatar}
      className="cursor-pointer rounded-full border-2 border-border bg-background p-1 shadow-sm ring-2 ring-foreground/10 ring-offset-2 ring-offset-background transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Switch avatar"
    >
      <Image
        src={avatarSrc}
        alt={`Portrait of ${name}`}
        width={128}
        height={128}
        priority
        fetchPriority="high"
        quality={75}
        sizes="128px"
        className="size-28 rounded-full border border-border/70 object-cover sm:size-32"
      />
    </button>
  );
}
