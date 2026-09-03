"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

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
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
          <div className="flex w-full items-center justify-between gap-4 sm:contents">
            <button
              type="button"
              onClick={switchAvatar}
              className="cursor-pointer rounded-full border-2 border-border bg-background p-1 shadow-sm ring-2 ring-foreground/10 ring-offset-2 ring-offset-background transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Switch avatar"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={avatarSrc}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden rounded-full"
                >
                  <Image
                    src={avatarSrc}
                    alt={`Portrait of ${site.name}`}
                    width={128}
                    height={128}
                    priority
                    unoptimized
                    className="size-28 rounded-full border border-border/70 sm:size-32"
                  />
                </motion.div>
              </AnimatePresence>
            </button>
            <TimeStatus className="sm:hidden" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Hi, I&apos;m {site.name}
            </h1>
            <p className="text-lg text-muted-foreground">{site.role}</p>
          </div>
        </div>
        <TimeStatus className="hidden sm:flex" />
      </div>
    </motion.section>
  );
}
