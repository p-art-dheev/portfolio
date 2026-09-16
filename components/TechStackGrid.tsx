import { techStack } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import { techIconMap } from "@/lib/tech-stack-icons";

export function TechStackGrid() {
  return (
    <Reveal>
    <section className="space-y-4">
      <h2 className="text-lg font-medium tracking-tight">Tech stack</h2>
      <ul className="flex flex-wrap gap-2">
        {techStack.map((item) => {
          const { Icon, color, adaptive } = techIconMap[item.icon];

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
