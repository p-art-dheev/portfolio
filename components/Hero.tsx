import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

import type { SiteContent } from "@/lib/content-types";
import { Avatar } from "@/components/Avatar";
import { Reveal } from "@/components/Reveal";
import { TimeStatus } from "@/components/TimeStatus";
import { SITE_NAME } from "@/lib/seo";
import { Button } from "@/components/ui/button";

export function Hero({ site }: { site: SiteContent }) {
  return (
    <Reveal>
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
            <div className="flex w-full items-center justify-between gap-4 sm:contents">
              <Avatar name={site.name} />
              <TimeStatus className="sm:hidden" />
            </div>
            <div className="space-y-2">
              {/* Sized so the full name always stays on one line beside the
                  avatar and status; on narrower screens only "Hi, I'm" may
                  sit on the line above it. */}
              <h1 className="metal-text font-display text-[2.6rem] leading-[1.05] font-normal tracking-[-0.01em] md:text-5xl lg:text-[3.5rem]">
                Hi, I&apos;m{" "}
                <span className="whitespace-nowrap">{SITE_NAME}</span>
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
