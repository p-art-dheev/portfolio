import { Mail } from "lucide-react";

import { site } from "@/lib/data";
import { Github, Linkedin } from "@/components/icons";
import { Button } from "@/components/ui/button";

const socials = [
  { href: site.socials.linkedin, label: "LinkedIn", icon: Linkedin },
  { href: site.socials.github, label: "GitHub", icon: Github },
  { href: site.socials.email, label: "Mail", icon: Mail },
] as const;

export function ConnectSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-medium tracking-tight">Connect</h2>
      <div className="flex items-center gap-2">
        {socials.map(({ href, label, icon: Icon }) => (
          <Button
            key={label}
            variant="outline"
            size="icon"
            className="transition-transform hover:-translate-y-0.5"
            asChild
          >
            <a
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
              aria-label={label}
            >
              <Icon className="size-4" />
            </a>
          </Button>
        ))}
      </div>
    </section>
  );
}
