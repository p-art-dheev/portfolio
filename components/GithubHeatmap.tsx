"use client";

import { useEffect, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { motion } from "motion/react";

import { Github } from "@/components/icons";
import { site } from "@/lib/data";
import { defaultTransition, defaultViewport, fadeInUp } from "@/lib/motion";
const githubTheme = {
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
};

const githubUsername = site.socials.github.replace(
  "https://github.com/",
  "",
);

export default function GithubHeatmap() {
  const [mounted, setMounted] = useState(false);
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    setMounted(true);

    const updateColorScheme = () => {
      setColorScheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light",
      );
    };

    updateColorScheme();

    const observer = new MutationObserver(updateColorScheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <motion.section
      className="space-y-4"
      variants={fadeInUp}
      initial="hidden"
      whileInView="show"
      viewport={defaultViewport}
      transition={defaultTransition}
    >      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-medium tracking-tight">GitHub Activity</h2>
        <a
          href={site.socials.github}
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <Github className="size-4" aria-hidden />
          @{githubUsername}
        </a>
      </div>

      <div className="heatmap-scroll -mx-1 px-1 pb-1">
        {mounted ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <GitHubCalendar
              username={githubUsername}
              year="last"
              showWeekdayLabels
              colorScheme={colorScheme}
              theme={githubTheme}
            />
          </motion.div>
        ) : (          <div
            className="bg-muted/40 h-[118px] w-full max-w-3xl animate-pulse rounded-lg"
            aria-hidden
          />
        )}
      </div>
    </motion.section>
  );
}