import type { Project, TechItem } from "@/lib/content-types";

export type { Project, ProjectStatus, TechItem } from "@/lib/content-types";

export const site = {
  name: "Pardheev",
  domain: "pardheev.dev",
  role: "Full-Stack Developer",
  tagline: "Building thoughtful products from idea to interface.",
  bio: "Hey, I’m Pardheev Vatturu, a final-year student and developer. I like building things, mostly around full-stack development, AI and ML, and I enjoy learning by actually making stuff. Outside of tech, I like drawing realism, and digital art. Recently, I’ve started reading books on philosophy, psychology, self-help and productivity. I’m usually curious about random things and enjoy figuring out how they work. If you’re interested, feel free to check out some of the things I’ve built and written about here.",
  college: "Amrita Vishwa Vidyapeetham",
  branch: "B.Tech Artificial Intelligence Engineering",
  year: "2023-2027",
  location: "Coimbatore, India",
  status: "online" as const,
  resume: "/resume/resume.pdf",
  avatars: ["/avatars/avatar-default.png", "/avatars/avatar.jpg"] as const,
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
  { href: "/blogs", label: "Blogs" },
] as const;

export const moreLinks = [{ href: "/books", label: "Books" }] as const;

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
