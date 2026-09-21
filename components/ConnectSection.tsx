import { Mail } from "lucide-react";

import type { SiteContent } from "@/lib/content-types";
import { Github, Linkedin } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

export function ConnectSection({ site }: { site: SiteContent }) {
  const socials = [
    { href: site.socials.linkedin, label: "LinkedIn", icon: Linkedin },
    { href: site.socials.github, label: "GitHub", icon: Github },
    { href: `mailto:${site.socials.email}`, label: "Email", icon: Mail },
  ] as const;

  return (
    <Reveal delay={0.05}>
      <section className="space-y-3">
        <h2 className="text-lg font-medium tracking-tight">Connect</h2>
        <div className="flex flex-wrap items-center gap-2">
          {socials.map(({ href, label, icon: Icon }) => (
            <Button
              key={label}
              variant="outline"
              className="gap-2 transition-transform hover:-translate-y-0.5"
              asChild
            >
              <a
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </a>
            </Button>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
