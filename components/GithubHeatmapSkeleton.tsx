import { Github } from "@/components/icons";
import { githubUsernameFromUrl } from "@/lib/sanitize";

export function GithubHeatmapSkeleton({ githubUrl }: { githubUrl: string }) {
  const githubUsername = githubUsernameFromUrl(githubUrl);
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-medium tracking-tight">GitHub Activity</h2>
        <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
          <Github className="size-4" aria-hidden />@{githubUsername}
        </span>
      </div>
      <div
        className="bg-muted/40 h-[118px] w-full max-w-3xl rounded-lg"
        aria-hidden
      />
    </section>
  );
}
