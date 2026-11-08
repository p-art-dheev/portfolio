import type { CSSProperties } from "react";

import type { TechItem } from "@/lib/content-types";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { techIconMap } from "@/lib/tech-stack-icons";

export function TechStackGrid({
  items,
  index,
}: {
  items: TechItem[];
  index: number;
}) {
  return (
    <Reveal>
      <section className="space-y-5">
        <SectionHeading
          index={index}
          eyebrow="Stack"
          title="What I build with"
        />
        <ul className="flex flex-wrap gap-2">
          {items.map((item) => {
            const config = techIconMap[item.icon];
            if (!config) return null;
            const { Icon, color, adaptive } = config;

            return (
              <li
                key={item.label}
                className="tech-pill metal-edge inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-transform hover:-translate-y-0.5"
                style={
                  {
                    "--brand": adaptive ? "var(--foreground)" : color,
                  } as CSSProperties
                }
              >
                <Icon className="size-3.5" aria-hidden />
                {item.label}
              </li>
            );
          })}
        </ul>
      </section>
    </Reveal>
  );
}
