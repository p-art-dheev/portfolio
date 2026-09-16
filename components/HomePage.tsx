import { Container } from "@/components/Container";
import { ConnectSection } from "@/components/ConnectSection";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { Hero } from "@/components/Hero";
import { AboutSection, EducationSection, ExploreSection } from "@/components/HomeSections";
import { TechStackGrid } from "@/components/TechStackGrid";
import { GithubHeatmapLazy } from "@/components/GithubHeatmapLazy";

export function HomePage() {
  return (
    <Container as="div" className="flex flex-col gap-10 py-8 sm:gap-12 sm:py-12">
      <Hero />
      <EducationSection />
      <AboutSection />
      <ConnectSection />
      <TechStackGrid />
      <GithubHeatmapLazy />
      <FeaturedProjects />
      <ExploreSection />
    </Container>
  );
}
