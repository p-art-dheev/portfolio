import { site } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { EducationCard } from "@/components/EducationCard";

export function EducationSection() {
  return (
    <section className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
      <EducationCard />
      <div className="flex flex-row gap-3 sm:flex-col sm:items-end">
        <Button className="flex-1 sm:w-36 sm:flex-none" asChild>
          <a href={site.resume} target="_blank" rel="noreferrer">
            Read Resume
          </a>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 sm:w-36 sm:flex-none"
        >
          Contact
        </Button>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-medium tracking-tight">About</h2>
      <p className="text-muted-foreground w-full leading-7 text-justify">
        {site.bio}
      </p>
      <p className="text-sm font-medium">{site.tagline}</p>
    </section>
  );
}
