"use client";

import { motion } from "motion/react";

import { Container } from "@/components/Container";
import { ProjectCard } from "@/components/ProjectCard";
import { featuredProjects } from "@/lib/data";
import {
  defaultTransition,
  defaultViewport,
  fadeInUp,
  staggerContainer,
} from "@/lib/motion";

export function ProjectsPage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
      <p className="text-muted-foreground mt-3 max-w-xl">
        Selected work across full-stack apps, NLP, and applied ML.
      </p>
      <motion.div
        className="mt-10 grid gap-8 sm:grid-cols-2"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={defaultViewport}
      >
        {featuredProjects.map((project) => (
          <motion.div
            key={project.slug}
            variants={fadeInUp}
            transition={defaultTransition}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>
    </Container>
  );
}
