import { Check, Mail } from "lucide-react";

import type { SiteContent } from "@/lib/content-types";
import { Discord, Github, Linkedin } from "@/components/icons";
import { DiscordLink } from "@/components/DiscordLink";
import { EmailLink } from "@/components/EmailLink";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { encodeEmail } from "@/lib/email";
import { Button } from "@/components/ui/button";

export function ConnectSection({
  site,
  index,
}: {
  site: SiteContent;
  index: number;
}) {
  const socials = [
    { href: site.socials.linkedin, label: "LinkedIn", icon: Linkedin },
    { href: site.socials.github, label: "GitHub", icon: Github },
  ] as const;
  const linkClass = "gap-2 transition-transform hover:-translate-y-0.5";

  return (
    <Reveal delay={0.05}>
      <section id="contact" className="scroll-mt-24 space-y-5">
        <SectionHeading index={index} eyebrow="Contact" title="Let’s connect" />
        <div className="flex flex-wrap items-center gap-2">
          {socials.map(({ href, label, icon: Icon }) => (
            <Button key={label} variant="outline" className={linkClass} asChild>
              <a href={href} target="_blank" rel="noreferrer">
                <Icon className="size-4" aria-hidden />
                {label}
              </a>
            </Button>
          ))}
          <Button variant="outline" className={linkClass} asChild>
            <EmailLink encoded={encodeEmail(site.socials.email)}>
              <Mail className="size-4" aria-hidden />
              Email
            </EmailLink>
          </Button>
          {site.socials.discord ? (
            <Button variant="outline" className={linkClass} asChild>
              <DiscordLink
                username={site.socials.discord}
                copiedLabel={
                  <>
                    <Check className="text-link size-4" aria-hidden />
                    Copied {site.socials.discord}
                  </>
                }
              >
                <Discord className="size-4" aria-hidden />
                Discord
              </DiscordLink>
            </Button>
          ) : null}
        </div>
      </section>
    </Reveal>
  );
}
