# Graph Report - portfolio  (2026-09-18)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 309 nodes · 518 edges · 15 communities (12 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `756ee1e7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14

## God Nodes (most connected - your core abstractions)
1. `cn()` - 42 edges
2. `compilerOptions` - 17 edges
3. `react` - 13 edges
4. `site` - 11 edges
5. `lucide-react` - 11 edges
6. `Container()` - 10 edges
7. `Button()` - 8 edges
8. `Reveal()` - 7 edges
9. `scripts` - 7 edges
10. `next` - 7 edges

## Surprising Connections (you probably didn't know these)
- `GridItem()` --calls--> `cn()`  [EXTRACTED]
  components/GalleryPhotogrid.tsx → lib/utils.ts
- `CardFooter()` --calls--> `cn()`  [EXTRACTED]
  components/ui/card.tsx → lib/utils.ts
- `Reveal()` --calls--> `cn()`  [EXTRACTED]
  components/Reveal.tsx → lib/utils.ts
- `TimeStatus()` --calls--> `cn()`  [EXTRACTED]
  components/TimeStatus.tsx → lib/utils.ts
- `DropdownMenuCheckboxItem()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dropdown-menu.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (15 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (34): AvatarSwitcher(), ConnectSection(), EducationCard(), FeaturedProjects(), Hero(), HomePage(), AboutSection(), EducationSection() (+26 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (36): Navbar(), navLinkClass(), applyTheme(), Theme, ThemeToggle(), toggleTheme(), Badge(), badgeVariants (+28 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (34): compat, __dirname, eslintConfig, __filename, name, private, scripts, build (+26 more)

### Community 3 - "Community 3"
Cohesion: 0.10
Nodes (16): metadata, metadata, Book(), BookProps, spring, BooksPage(), Container(), ContainerProps (+8 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 5 - "Community 5"
Cohesion: 0.12
Nodes (12): metadata, ArtworksPage(), photos, GalleryPhoto, GalleryPhotogrid(), GalleryPhotogridProps, GridItem(), Lightbox() (+4 more)

### Community 6 - "Community 6"
Cohesion: 0.14
Nodes (13): metadata, ProjectCard(), ProjectCardProps, statusStyles, ProjectsPage(), Card(), CardAction(), CardContent() (+5 more)

### Community 7 - "Community 7"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules, jsx, lib (+11 more)

### Community 8 - "Community 8"
Cohesion: 0.18
Nodes (11): socials, githubTheme, githubUsername, GithubHeatmapLazy, GithubHeatmapSkeleton(), githubUsername, Github, Linkedin (+3 more)

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (17): dependencies, class-variance-authority, clsx, lucide-react, motion, next, radix-ui, react (+9 more)

### Community 10 - "Community 10"
Cohesion: 0.15
Nodes (13): devDependencies, eslint, eslint-config-next, eslint-config-prettier, @eslint/eslintrc, prettier, prettier-plugin-tailwindcss, tailwindcss (+5 more)

### Community 11 - "Community 11"
Cohesion: 0.18
Nodes (9): app_globals, geistMono, geistSans, metadata, Footer(), ThemeScript(), ref_next_font_google, ref_vercel_analytics_next (+1 more)

## Knowledge Gaps
- **130 isolated node(s):** `RevealProps`, `TimeStatusProps`, `TechItem`, `TechIconConfig`, `Theme` (+125 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 161 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Community 0` to `Community 1`, `Community 2`, `Community 5`, `Community 6`, `Community 8`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 1` to `Community 0`, `Community 3`, `Community 5`, `Community 6`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `Community 8` to `Community 0`, `Community 1`, `Community 2`, `Community 6`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **What connects `RevealProps`, `TimeStatusProps`, `TechItem` to the rest of the system?**
  _130 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08687943262411348 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._