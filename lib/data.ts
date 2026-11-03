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
  { href: "/blogs", label: "Blog" },
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
  { label: "FastAPI", icon: "fastapi" },
  { label: "PyTorch", icon: "pytorch" },
  { label: "Hugging Face", icon: "huggingface" },
  { label: "Supabase", icon: "supabase" },
];

// Fallback content when Supabase isn't configured. The live site reads
// projects from Supabase; supabase/migrate-project-case-studies.sql carries the
// same case-study text.
export const featuredProjects: Project[] = [
  {
    slug: "project-one",
    title: "Electricity Load Forecasting",
    description:
      "Forecasted electricity demand using 16 years of PJM hourly load data with time-series analysis and SARIMA/SETAR models.",
    banner: "/projects/project-one/banner.png",
    tags: ["Python", "LSTM", "Time Series Analysis"],
    githubUrl: "https://github.com/p-art-dheev/PJME-Weekly-Forecast",
    status: "off",
    problem:
      "Grid operators plan generation weeks ahead, so they need reliable forecasts of weekly demand. I wanted to see how classical statistical models, a regime-switching model and a neural network compare on the same real grid data.",
    role: "Solo project: data preparation, analysis, modelling and evaluation.",
    approach:
      "I aggregated PJM East (PJME) hourly load into weekly totals and split it by time, with about 730 weeks for training and 105 for testing. I checked stationarity with ADF and KPSS tests and ACF/PACF plots, and decomposed the series into trend and seasonality.\n\nThen I fit four models: a baseline SARIMA, an auto_arima-tuned SARIMA, a SETAR(2,1) threshold model and a stacked LSTM. Each was scored on the same held-out weeks with MAE, RMSE and MAPE.",
    outcome:
      "Weekly demand has a strong 52-week seasonal cycle on top of a clear trend. The seasonal ARIMA baseline reached 14.6% MAPE on the held-out weeks, which set the bar the other models were compared against.",
    highlights: [
      "About 730 training weeks and 105 test weeks of PJME load",
      "4 models compared: 2 SARIMA, SETAR and LSTM",
      "Baseline SARIMA: 14.6% MAPE on held-out data",
    ],
  },
  {
    slug: "project-two",
    title: "Aspect Based Sentiment Analysis",
    description:
      "Built a BERT-based NLP model to classify sentiment from abstract or context-rich text.",
    banner: "/projects/project-two/banner.png",
    tags: ["BERT", "Transformers", "NLP"],
    githubUrl: "https://github.com/p-art-dheev/absa",
    status: "off",
    problem:
      'A review like "great battery, dim screen" is neither positive nor negative overall. Aspect-based sentiment analysis predicts the sentiment toward each specific aspect, which is what a product team actually needs.',
    role: "Solo project: preprocessing, baselines, model experiments and evaluation.",
    approach:
      "I used the SemEval ATSA laptop and restaurant review datasets. I first built TF-IDF baselines (Naive Bayes and softmax regression, implemented by hand), then fine-tuned BERT-family encoders with the sentence and the aspect encoded as a pair.\n\nI compared plain BERT, BERT with LSTM and attention heads, RoBERTa and DeBERTa, and ran a QLoRA (4-bit + LoRA) experiment. Because the datasets are small, I used stratified k-fold cross-validation to get stable estimates.",
    outcome:
      "On the laptop test set, RoBERTa-base was the strongest model, with 81.0% accuracy and 0.78 macro-F1. The classical TF-IDF baselines reached 65 to 70% accuracy.",
    highlights: [
      "RoBERTa-base: 81.0% accuracy and 0.78 macro-F1 on the laptop test set",
      "7 approaches compared, from TF-IDF baselines to QLoRA",
      "Stratified k-fold cross-validation on small datasets",
    ],
  },
  {
    slug: "project-three",
    title: "Codeproctor",
    description:
      "Developed a web-based coding assessment platform for conducting and managing programming tests.",
    banner: "/projects/project-three/1.png",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    status: "off",
    gallery: [
      "/projects/gallery/03/2.png",
      "/projects/gallery/03/3.png",
      "/projects/gallery/03/4.png",
    ],
  },
  {
    slug: "project-four",
    title: "Meal Nutrition Optimizer",
    description:
      "Developed a nutrition-focused application that recommends meals based on individual calorie and nutritional requirements.",
    banner: "/projects/project-four/banner.png",
    tags: ["Python", "FastAPI", "React", "PuLP"],
    githubUrl: "https://github.com/p-art-dheev/nutrix",
    status: "Building",
    problem:
      "Planning meals that hit calorie, protein and micronutrient targets at a low cost is a constrained optimisation problem that people usually solve by guesswork.",
    role: "Built the full stack: the FastAPI backend, the optimisation models and the React + TypeScript frontend.",
    approach:
      "Users upload a food dataset. The backend cleans it, dropping empty rows and rows whose macros are physically impossible under the 4-4-9 kcal rule, then shows descriptive statistics, distributions and correlations.\n\nTwo models are solved with PuLP and the CBC solver: a linear program for an optimal protein diet, and a mixed-integer program that picks foods to cover nutrient deficiencies. The app deploys as one Vercel project, with the API as a Python function and uploads stored in Vercel Blob.",
    outcome:
      "An end-to-end app: upload a dataset, explore it, and get a meal plan that meets the nutritional constraints.",
    highlights: [
      "LP and MILP models solved with the CBC solver",
      "Data validation using the 4-4-9 kcal rule",
      "FastAPI and React, deployed together on Vercel",
    ],
  },
];
