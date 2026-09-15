export type Artwork = {
  title: string;
  image: { src: string; alt: string; width: number; height: number };
  link?: string;
};

export const artworks: Artwork[] = [
  {
    title: "Radha Krishna",
    image: {
      src: "/artworks/011.jpeg",
      alt: "Pencil drawing of Radha and Krishna",
      width: 1024,
      height: 1280,
    },
  },
  {
    title: "Thorfinn",
    image: {
      src: "/artworks/021.jpeg",
      alt: "Watercolor portrait of Thorfinn",
      width: 1024,
      height: 1280,
    },
  },
  {
    title: "Krishna",
    image: {
      src: "/artworks/031.jpeg",
      alt: "Colored pencil portrait of Krishna",
      width: 1023,
      height: 1280,
    },
  },
  {
    title: "Golden Retriever",
    image: {
      src: "/artworks/041.jpeg",
      alt: "Digital painting of a golden retriever puppy",
      width: 1024,
      height: 1280,
    },
  },
  {
    title: "Gaze",
    image: {
      src: "/artworks/051.jpeg",
      alt: "Charcoal drawing of eyes with a red bindi",
      width: 1050,
      height: 720,
    },
  },
  {
    title: "beluga",
    image: {
      src: "/artworks/061.jpg",
      alt: "Ink sketch of a cat's face",
      width: 1002,
      height: 1280,
    },
  },
  {
    title: "Cradled",
    image: {
      src: "/artworks/071.jpg",
      alt: "Pencil drawing of a newborn held in adult hands",
      width: 954,
      height: 1280,
    },
  },
  {
    title: "Anime character",
    image: {
      src: "/artworks/081.jpg",
      alt: "Pencil portrait of a young woman",
      width: 991,
      height: 561,
    },
  },
  {
    title: "Eye",
    image: {
      src: "/artworks/091.jpeg",
      alt: "Graphite drawing of an eye",
      width: 720,
      height: 894,
    },
  },
  {
    title: "Ram and Bheem",
    image: {
      src: "/artworks/101.jpg",
      alt: "Pencil drawing of two men",
      width: 780,
      height: 1040,
    },
  },
  {
    title: "Who Wore It Better",
    image: {
      src: "/artworks/111.jpg",
      alt: "Drawing of a tabby cat in sunglasses",
      width: 1180,
      height: 1280,
    },
  },
  {
    title: "Ana De Armas",
    image: {
      src: "/artworks/121.jpg",
      alt: "Realistic graphite portrait of a woman",
      width: 1024,
      height: 1280,
    },
  },
];
