export const site = {
  name: "Pardheev",
  domain: "pardheev.dev",
  role: "Full-Stack Developer",
  tagline: "Building thoughtful products from idea to interface.",
  bio: "I'm a full-stack developer who enjoys turning messy problems into clean, reliable software. This paragraph is placeholder copy — swap it for a real bio when you're ready.",
  college: "Placeholder University · Computer Science",
  status: "online" as const,
  socials: {
    linkedin: "https://linkedin.com/in/your-handle",
    github: "https://github.com/your-handle",
    email: "mailto:hello@pardheev.dev",
  },
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blogs", label: "Blogs" },
] as const;

export const moreLinks = [
  { href: "/books", label: "Books" },
  { href: "/artworks", label: "Artworks" },
] as const;

export type TechItem = {
  label: string;
  icon:
    | "code"
    | "component"
    | "wind"
    | "server"
    | "database"
    | "git"
    | "terminal"
    | "layers";
};

export const techStack: TechItem[] = [
  { label: "TypeScript", icon: "code" },
  { label: "Next.js", icon: "layers" },
  { label: "React", icon: "component" },
  { label: "Tailwind CSS", icon: "wind" },
  { label: "Node.js", icon: "server" },
  { label: "PostgreSQL", icon: "database" },
  { label: "Git", icon: "git" },
  { label: "Python", icon: "terminal" },
];

export type Project = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
};

export const featuredProjects: Project[] = [
  {
    slug: "project-one",
    title: "Project One",
    description:
      "A placeholder product that solves an interesting problem. Replace this with a real case study later.",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    href: "/projects",
  },
  {
    slug: "project-two",
    title: "Project Two",
    description:
      "Another featured build with a short summary of the outcome and the stack behind it.",
    tags: ["React", "Node.js", "Tailwind"],
    href: "/projects",
  },
  {
    slug: "project-three",
    title: "Project Three",
    description:
      "A third card so the grid looks complete. Wire this up to real project data when it's ready.",
    tags: ["Python", "APIs", "Design"],
    href: "/projects",
  },
];
