export const site = {
  name: "Pardheev",
  domain: "pardheev.dev",
  role: "Full-Stack Developer",
  tagline: "Building thoughtful products from idea to interface.",
  bio: "I'm a full-stack developer who enjoys turning messy problems into clean, reliable software. This paragraph is placeholder copy — swap it for a real bio when you're ready.",
  college: "Amrita Vishwa Vidyapeetham",
  branch: "Artificial Intelligence Engineering",
  year: "2023-2027",
  location: "Coimbatore, India",
  status: "online" as const,
  resume: "/resume/resume.pdf",
  avatars: [
    "/avatars/avatar-default.png",
    "/avatars/avatar.jpg",
  ] as const,
  socials: {
    linkedin: "https://linkedin.com/in/pardheev-vatturu/",
    github: "https://github.com/p-art-dheev",
    email: "pardheev.vatturu1234@gmail.com",
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

export type ProjectStatus = "off" | "live" | "Building";

export type Project = {
  slug: string;
  title: string;
  description: string;
  banner?: string;
  tags: string[];
  href: string;
  status: ProjectStatus;
};

export const featuredProjects: Project[] = [
  {
    slug: "project-one",
    title: "Electricity Load Forecasting",
    description:
      "A placeholder product that solves an interesting problem. Replace this with a real case study later.",
    banner: "/projects/project-one/banner.png",
    tags: ["Python", "LSTM", "Time Series Analysis"],
    href: "/projects",
    status: "live",
  },
  {
    slug: "project-two",
    title: "Abstract Based Semtiment Analysis",
    description:
      "Another featured build with a short summary of the outcome and the stack behind it.",
    banner: "/projects/project-two/banner.png",
    tags: ["BERT", "Transformers", "NLP"],
    href: "/projects",
    status: "Building",
  },
  {
    slug: "project-three",
    title: "Codeproctor",
    description:
      "A third card so the grid looks complete. Wire this up to real project data when it's ready.",
    banner: "/projects/project-three/1.png",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    href: "/projects",
    status: "off",
  },
  {
    slug: "project-four",
    title: "Meal Nutrition Optimizer",
    description:
      "A third card so the grid looks complete. Wire this up to real project data when it's ready.",
    banner: "/projects/project-four/banner.png",
    tags: ["Python", "FastAPI", "React", "PuLP"],
    href: "/projects",
    status: "Building",
  },
];
