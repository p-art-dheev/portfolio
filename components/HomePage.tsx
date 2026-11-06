import { Container } from "@/components/Container";
import { ConnectSection } from "@/components/ConnectSection";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { Hero } from "@/components/Hero";
import {
  AboutSection,
  EducationSection,
  ExploreSection,
} from "@/components/HomeSections";
import { TechStackGrid } from "@/components/TechStackGrid";
import { GithubHeatmap } from "@/components/GitHubActivitySection";
import { getGithubContributions } from "@/lib/github";
import { getFeaturedProjects, getSiteSettings } from "@/lib/queries";
import { githubUsernameFromUrl } from "@/lib/sanitize";

export async function HomePage() {
  // Only cookie-free reads here so the page is prerendered and served from
  // the CDN. GitHub contributions are fetched here too (cached for a day).
  const [site, projects] = await Promise.all([
    getSiteSettings(),
    getFeaturedProjects(),
  ]);
  const github = await getGithubContributions(
    githubUsernameFromUrl(site.socials.github),
  );

  return (
    <Container
      as="div"
      className="flex flex-col gap-10 py-8 sm:gap-12 sm:py-12"
    >
      <Hero site={site} />
      <AboutSection site={site} />
      <EducationSection site={site} />
      <TechStackGrid items={site.techStack} />
      <GithubHeatmap githubUrl={site.socials.github} data={github} />
      <FeaturedProjects projects={projects} />
      <ConnectSection site={site} />
      <ExploreSection />
    </Container>
  );
}
