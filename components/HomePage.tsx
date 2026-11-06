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

  // Sections are numbered in order (01 · About, 02 · Education, ...),
  // skipping any that have nothing to show.
  let section = 0;
  const next = () => ++section;

  return (
    <Container
      as="div"
      className="flex flex-col gap-14 py-8 sm:gap-20 sm:py-14"
    >
      <Hero site={site} />
      <AboutSection site={site} index={next()} />
      <EducationSection site={site} index={next()} />
      <TechStackGrid items={site.techStack} index={next()} />
      <GithubHeatmap
        githubUrl={site.socials.github}
        data={github}
        index={next()}
      />
      {projects.length > 0 ? (
        <FeaturedProjects projects={projects} index={next()} />
      ) : null}
      <ConnectSection site={site} index={next()} />
      <ExploreSection index={next()} />
    </Container>
  );
}
