import type { TechItem } from "@/lib/content-types";
import { Reveal } from "@/components/Reveal";
import { techIconMap } from "@/lib/tech-stack-icons";

export function TechStackGrid({ items }: { items: TechItem[] }) {
  return (
    <Reveal>
    <section className="space-y-4">
      <h2 className="text-lg font-medium tracking-tight">Tech stack</h2>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => {
          const config = techIconMap[item.icon];
          if (!config) return null;
          const { Icon, color, adaptive } = config;

          return (
            <li
              key={item.label}
              className="border-border bg-card inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-transform hover:-translate-y-0.5"
            >
              <Icon
                className={adaptive ? "size-3.5 text-foreground" : "size-3.5"}
                style={adaptive ? undefined : { color }}
                aria-hidden
              />
              {item.label}
            </li>
          );
        })}
      </ul>
    </section>
    </Reveal>
  );
}
