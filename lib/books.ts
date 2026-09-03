export type BookCover = {
  src: string;
  alt: string;
};

export type Book = {
  title: string;
  subtitle: string;
  author: string;
  coverImage: BookCover;
};

export const books: Book[] = [
  {
    title: "Eat That Frog!",
    subtitle: "21 Great Ways to Stop Procrastinating and Get More Done in Less Time",
    author: "Brian Tracy",
    coverImage: {
      src: "/books/01.jpg",
      alt: "Eat That Frog! by Brian Tracy",
    },
  },
  {
    title: "Atomic Habits",
    subtitle: "Tiny Changes, Remarkable Results",
    author: "James Clear",
    coverImage: {
      src: "/books/02.jpg",
      alt: "Atomic Habits by James Clear",
    },
  },
  {
    title: "The Courage to Be Disliked",
    subtitle: "A single book can change your life",
    author: "Ichiro Kishimi and Fumitake Koga",
    coverImage: {
      src: "/books/03.jpg",
      alt: "The Courage to Be Disliked by Ichiro Kishimi and Fumitake Koga",
    },
  },
  {
    title: "The Mountain Is You",
    subtitle: "Transforming Self-Sabotage into Self-Mastery",
    author: "Brianna Wiest",
    coverImage: {
      src: "/books/04.jpg",
      alt: "The Mountain Is You by Brianna Wiest",
    },
  },
  {
    title: "Man's Search for Meaning",
    subtitle: "The classic tribute to hope from the Holocaust",
    author: "Viktor E. Frankl",
    coverImage: {
      src: "/books/05.jpg",
      alt: "Man's Search for Meaning by Viktor E. Frankl",
    },
  },
];
