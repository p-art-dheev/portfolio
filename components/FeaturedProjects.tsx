"use client";

import { motion } from "motion/react";

import { featuredProjects } from "@/lib/data";
import {
  defaultTransition,
  defaultViewport,
  fadeInUp,
  staggerContainer,
} from "@/lib/motion";
import { ProjectCard } from "@/components/ProjectCard";

export function FeaturedProjects() {
  return (
    <section className="space-y-4">
      <motion.h2
        className="text-lg font-medium tracking-tight"
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={defaultViewport}
        transition={defaultTransition}
      >
        Featured projects
      </motion.h2>
      <motion.div
        className="grid gap-8 sm:grid-cols-2"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={defaultViewport}
      >
        {featuredProjects.map((project) => (
          <motion.div key={project.slug} variants={fadeInUp}>
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
