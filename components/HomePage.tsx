import { Container } from "@/components/Container";
import { ConnectSection } from "@/components/ConnectSection";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { Hero } from "@/components/Hero";
import { AboutSection, EducationSection, ExploreSection } from "@/components/HomeSections";
import { TechStackGrid } from "@/components/TechStackGrid";
import { GithubHeatmapLazy } from "@/components/GithubHeatmapLazy";
import {
  getFeaturedProjects,
  getSiteSettings,
} from "@/lib/queries";

export async function HomePage() {
  const [site, projects] = await Promise.all([
    getSiteSettings(),
    getFeaturedProjects(),
  ]);

  return (
    <Container as="div" className="flex flex-col gap-10 py-8 sm:gap-12 sm:py-12">
      <Hero site={site} />
      <EducationSection site={site} />
      <AboutSection site={site} />
      <ConnectSection site={site} />
      <TechStackGrid items={site.techStack} />
      <GithubHeatmapLazy githubUrl={site.socials.github} />
      <FeaturedProjects projects={projects} />
      <ExploreSection />
    </Container>
  );
}
