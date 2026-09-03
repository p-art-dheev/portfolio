export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

export const defaultViewport = { once: true, amount: 0.2 } as const;

export const defaultTransition = {
  duration: 0.5,
  ease: "easeOut" as const,
};
