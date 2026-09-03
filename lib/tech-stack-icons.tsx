import {
  SiCss,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiNumpy,
  SiPandas,
  SiPostgresql,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import type { IconType } from "react-icons";

export type TechIconKey =
  | "typescript"
  | "nextjs"
  | "react"
  | "tailwindcss"
  | "nodejs"
  | "postgresql"
  | "git"
  | "github"
  | "python"
  | "html"
  | "css"
  | "javascript"
  | "numpy"
  | "pandas";

type TechIconConfig = {
  Icon: IconType;
  color: string;
  adaptive?: boolean;
};

export const techIconMap: Record<TechIconKey, TechIconConfig> = {
  typescript: { Icon: SiTypescript, color: "#3178C6" },
  nextjs: { Icon: SiNextdotjs, color: "#000000", adaptive: true },
  react: { Icon: SiReact, color: "#61DAFB" },
  tailwindcss: { Icon: SiTailwindcss, color: "#06B6D4" },
  nodejs: { Icon: SiNodedotjs, color: "#339933" },
  postgresql: { Icon: SiPostgresql, color: "#4169E1" },
  git: { Icon: SiGit, color: "#F05032" },
  github: { Icon: SiGithub, color: "#181717", adaptive: true },
  python: { Icon: SiPython, color: "#3776AB" },
  html: { Icon: SiHtml5, color: "#E34F26" },
  css: { Icon: SiCss, color: "#1572B6" },
  javascript: { Icon: SiJavascript, color: "#F7DF1E" },
  numpy: { Icon: SiNumpy, color: "#013243" },
  pandas: { Icon: SiPandas, color: "#150458" },
};
