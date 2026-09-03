import { GraduationCap } from "lucide-react";

import { site } from "@/lib/data";

export function EducationCard() {
  return (
    <div className="border-border w-fit max-w-lg space-y-2.5 border-l-2 pl-4">
      <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium tracking-wide uppercase">
        <GraduationCap className="size-4 shrink-0" aria-hidden />
        <span>Education</span>
      </div>

      <p className="text-base leading-snug font-medium">{site.college}</p>

      <p className="text-muted-foreground text-sm leading-relaxed">
        {site.branch}
      </p>

      <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span className="bg-muted/60 rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide">
          {site.year}
        </span>
        <span>{site.location}</span>
      </div>
    </div>
  );
}
