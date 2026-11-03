import { Mail } from "lucide-react";

import type { SiteContent } from "@/lib/content-types";
import { EmailLink } from "@/components/EmailLink";
import { Github, Linkedin } from "@/components/icons";
import { encodeEmail } from "@/lib/email";
import { Container } from "@/components/Container";

export function Footer({ site }: { site: SiteContent }) {
  return (
    <footer className="border-border/80 mt-auto border-t">
      <Container className="flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="text-muted-foreground space-y-1">
          <p>
            © {new Date().getFullYear()} {site.name}. Built for {site.domain}.
          </p>
          <p className="text-xs">
            This site uses Vercel Analytics
            {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID
              ? " and Microsoft Clarity"
              : ""}{" "}
            to see how pages are used. No ads, no data sold.
          </p>
        </div>
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
          <EmailLink
            encoded={encodeEmail(site.socials.email)}
            aria-label="Email"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="size-4" />
          </EmailLink>
        </div>
      </Container>
    </footer>
  );
}
