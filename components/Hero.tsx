import type { SiteContent } from "@/lib/content-types";
import { AvatarSwitcher } from "@/components/AvatarSwitcher";
import { Reveal } from "@/components/Reveal";
import { TimeStatus } from "@/components/TimeStatus";
import { VisitorCount } from "@/components/VisitorCount";

export function Hero({
  site,
  visitorCount,
}: {
  site: SiteContent;
  visitorCount: number;
}) {
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
            <p className="text-lg text-muted-foreground">{site.role}</p>
            <VisitorCount initialCount={visitorCount} />
          </div>
        </div>
        <TimeStatus className="hidden sm:flex" />
      </div>
    </section>
    </Reveal>
  );
}
