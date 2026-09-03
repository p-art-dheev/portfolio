"use client";

import { motion } from "motion/react";

import { techStack } from "@/lib/data";
import { techIconMap } from "@/lib/tech-stack-icons";

const listVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function TechStackGrid() {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-medium tracking-tight">Tech stack</h2>
      <motion.ul
        className="flex flex-wrap gap-2"
        variants={listVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
      >
        {techStack.map((item) => {
          const { Icon, color, adaptive } = techIconMap[item.icon];

          return (
            <motion.li
              key={item.label}
              variants={itemVariants}
              className="border-border bg-card inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm"
            >
              <Icon
                className={adaptive ? "size-3.5 text-foreground" : "size-3.5"}
                style={adaptive ? undefined : { color }}
                aria-hidden
              />
              {item.label}
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}
