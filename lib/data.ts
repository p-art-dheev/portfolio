export const site = {
  name: "Pardheev",
  domain: "pardheev.dev",
  role: "Full-Stack Developer",
  tagline: "Building thoughtful products from idea to interface.",
  bio: "Hey, I’m Pardheev, a final-year student and developer who likes turning ideas into things that actually work. I’m focused on full-stack development, Artificial Intelligence, and Machine Learning, building everything from polished web applications to data-driven and intelligent systems. I enjoy working across the stack from crafting clean interfaces and scalable backends to designing databases and experimenting with ML models. I’m curious by nature and constantly learning through the things I build. Whether it’s solving a complex problem, exploring a new technology, or turning a rough idea into a working product, I enjoy the process of figuring things out and making them better.",
  college: "Amrita Vishwa Vidyapeetham",
  branch: "B.Tech Artificial Intelligence Engineering",
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

import type { TechIconKey } from "@/lib/tech-stack-icons";

export type TechItem = {
  label: string;
  icon: TechIconKey;
};

export const techStack: TechItem[] = [
  { label: "TypeScript", icon: "typescript" },
  { label: "Next.js", icon: "nextjs" },
  { label: "React", icon: "react" },
  { label: "Tailwind CSS", icon: "tailwindcss" },
  { label: "Node.js", icon: "nodejs" },
  { label: "PostgreSQL", icon: "postgresql" },
  { label: "Git", icon: "git" },
  { label: "GitHub", icon: "github" },
  { label: "Python", icon: "python" },
  { label: "HTML", icon: "html" },
  { label: "CSS", icon: "css" },
  { label: "JavaScript", icon: "javascript" },
  { label: "NumPy", icon: "numpy" },
  { label: "pandas", icon: "pandas" },
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
