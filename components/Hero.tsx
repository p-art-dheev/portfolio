import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

import type { SiteContent } from "@/lib/content-types";
import { AvatarSwitcher } from "@/components/AvatarSwitcher";
import { Reveal } from "@/components/Reveal";
import { TimeStatus } from "@/components/TimeStatus";
import { Button } from "@/components/ui/button";

export function Hero({ site }: { site: SiteContent }) {
  return (
    <Reveal>
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
            <div className="flex w-full items-center justify-between gap-4 sm:contents">
              <AvatarSwitcher avatars={site.avatars} name={site.name} />
              <TimeStatus className="sm:hidden" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Hi, I&apos;m {site.name}
              </h1>
              <p className="text-muted-foreground text-lg">{site.role}</p>
            </div>
          </div>
          <TimeStatus className="hidden sm:flex" />
        </div>
        {site.tagline ? (
          <p className="max-w-2xl text-lg leading-8">{site.tagline}</p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="group/cta">
            <Link href="/projects">
              View projects
              <ArrowRight className="size-4 transition-transform group-hover/cta:translate-x-0.5" />
            </Link>
          </Button>
          {site.resume ? (
            <Button asChild size="lg" variant="outline">
              <a href={site.resume} target="_blank" rel="noreferrer">
                <FileText className="size-4" aria-hidden />
                Resume
              </a>
            </Button>
          ) : null}
        </div>
      </section>
    </Reveal>
  );
}
