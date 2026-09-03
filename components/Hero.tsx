"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";

import { site } from "@/lib/data";
import { TimeStatus } from "@/components/TimeStatus";

export function Hero() {
  const [avatarIndex, setAvatarIndex] = useState(0);
  const avatarSrc = site.avatars[avatarIndex];

  function switchAvatar() {
    setAvatarIndex((index) => (index + 1) % site.avatars.length);
  }

  return (
    <motion.section
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10">
          <button
            type="button"
            onClick={switchAvatar}
            className="rounded-full ring-1 ring-border transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Switch avatar"
          >
            <Image
              src={avatarSrc}
              alt={`Portrait of ${site.name}`}
              width={128}
              height={128}
              priority
              unoptimized
              className="size-28 rounded-full sm:size-32"
            />
          </button>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Hi, I&apos;m {site.name}
            </h1>
            <p className="text-lg text-muted-foreground">{site.role}</p>
          </div>
        </div>
        <TimeStatus className="self-end" />
      </div>
    </motion.section>
  );
}
