"use client";

import {
  Code2,
  Component,
  Database,
  GitBranch,
  Layers,
  Server,
  SquareTerminal,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";

import { techStack, type TechItem } from "@/lib/data";

const icons: Record<TechItem["icon"], LucideIcon> = {
  code: Code2,
  component: Component,
  wind: Wind,
  server: Server,
  database: Database,
  git: GitBranch,
  terminal: SquareTerminal,
  layers: Layers,
};

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
          const Icon = icons[item.icon];
          return (
            <motion.li
              key={item.label}
              variants={itemVariants}
              className="border-border bg-card inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm"
            >
              <Icon className="text-muted-foreground size-3.5" aria-hidden />
              {item.label}
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}
