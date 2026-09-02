"use client";

import Image from "next/image";
import { motion } from "motion/react";

import { site } from "@/lib/data";

export function Hero() {
  return (
    <motion.section
      className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <Image
        src="/placeholder-avatar.svg"
        alt="Placeholder portrait of Pardheev"
        width={128}
        height={128}
        priority
        unoptimized
        className="ring-border size-28 rounded-full ring-1 sm:size-32"
      />
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Hi, I&apos;m Pardheev
        </h1>
        <p className="text-muted-foreground text-lg">{site.role}</p>
      </div>
    </motion.section>
  );
}
