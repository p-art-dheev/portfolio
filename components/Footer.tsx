import { Mail } from "lucide-react";

import { site } from "@/lib/data";
import { Github, Linkedin } from "@/components/icons";
import { Container } from "@/components/Container";

export function Footer() {
  return (
    <footer className="border-border/80 mt-auto border-t">
      <Container className="flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">
          © {new Date().getFullYear()} {site.name}. Built for {site.domain}.
        </p>
        <div className="flex items-center gap-4">
          <a
            href={site.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Linkedin className="size-4" />
          </a>
          <a
            href={site.socials.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="size-4" />
          </a>
          <a
            href={`mailto:${site.socials.email}`}
            aria-label="Email"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="size-4" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
