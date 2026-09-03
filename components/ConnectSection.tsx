"use client";

import { Mail } from "lucide-react";
import { motion } from "motion/react";

import { site } from "@/lib/data";
import { Github, Linkedin } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  defaultTransition,
  defaultViewport,
  fadeInUp,
  staggerContainer,
} from "@/lib/motion";

const socials = [
  { href: site.socials.linkedin, label: "LinkedIn", icon: Linkedin },
  { href: site.socials.github, label: "GitHub", icon: Github },
  { href: site.socials.email, label: "Mail", icon: Mail },
] as const;

export function ConnectSection() {
  return (
    <section className="space-y-3">
      <motion.h2
        className="text-lg font-medium tracking-tight"
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={defaultViewport}
        transition={defaultTransition}
      >
        Connect
      </motion.h2>
      <motion.div
        className="flex items-center gap-2"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={defaultViewport}
      >
        {socials.map(({ href, label, icon: Icon }) => (
          <motion.div key={label} variants={fadeInUp} whileHover={{ y: -2 }}>
            <Button variant="outline" size="icon" asChild>
              <a
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
                aria-label={label}
              >
                <Icon className="size-4" />
              </a>
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
