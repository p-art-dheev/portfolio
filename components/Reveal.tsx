"use client";

import { motion, type HTMLMotionProps } from "motion/react";

import { defaultTransition, defaultViewport, fadeInUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
  ...props
}: RevealProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={fadeInUp}
      initial="hidden"
      whileInView="show"
      viewport={defaultViewport}
      transition={{ ...defaultTransition, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
