export const site = {
  name: "Pardheev",
  domain: "pardheev.dev",
  role: "Full-Stack Developer",
  tagline: "Building thoughtful products from idea to interface.",
  bio: [
    "Final-year student building things across full-stack development, AI, and ML. I learn best by shipping — real projects, real constraints.",
    "Outside of tech, I draw realism and digital art, and I’ve been reading into philosophy, psychology, and productivity. Usually chasing whatever I’m curious about.",
  ],
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
  { href: "/artworks", label: "Artworks" },
] as const;

export const moreLinks = [
  { href: "/books", label: "Books" },
  { href: "/blogs", label: "Blogs" },
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
  href?: string;
  status: ProjectStatus;
};

export const featuredProjects: Project[] = [
  {
    slug: "project-one",
    title: "Electricity Load Forecasting",
    description:
      "Forecasted electricity demand using 16 years of PJM hourly load data with time-series analysis and SARIMA/SETAR models.",
    banner: "/projects/project-one/banner.png",
    tags: ["Python", "LSTM", "Time Series Analysis"],
    status: "off",
  },
  {
    slug: "project-two",
    title: "Aspect Based Sentiment Analysis",
    description:
      "Built a BERT-based NLP model to classify sentiment from abstract or context-rich text.",
    banner: "/projects/project-two/banner.png",
    tags: ["BERT", "Transformers", "NLP"],
    status: "off",
  },
  {
    slug: "project-three",
    title: "Codeproctor",
    description:
      "Developed a web-based coding assessment platform for conducting and managing programming tests.",
    banner: "/projects/project-three/1.png",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    status: "off",
  },
  {
    slug: "project-four",
    title: "Meal Nutrition Optimizer",
    description:
      "Developed a nutrition-focused application that recommends meals based on individual calorie and nutritional requirements.",
    banner: "/projects/project-four/banner.png",
    tags: ["Python", "FastAPI", "React", "PuLP"],
    href: "https://github.com/p-art-dheev/nutrition-based-meal-optimization",
    status: "Building",
  },
];
