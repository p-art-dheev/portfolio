export type Artwork = {
  title: string;
  image: { src: string; alt: string };
  link?: string;
};

export const artworks: Artwork[] = [
  {
    title: "Radha Krishna",
    image: {
      src: "/artworks/011.jpeg",
      alt: "Pencil drawing of Radha and Krishna",
    },
  },
  {
    title: "Thorfinn",
    image: {
      src: "/artworks/021.jpeg",
      alt: "Watercolor portrait of Thorfinn",
    },
  },
  {
    title: "Krishna",
    image: {
      src: "/artworks/031.jpeg",
      alt: "Colored pencil portrait of Krishna",
    },
  },
  {
    title: "Golden Retriever",
    image: {
      src: "/artworks/041.jpeg",
      alt: "Digital painting of a golden retriever puppy",
    },
  },
  {
    title: "Gaze",
    image: {
      src: "/artworks/051.jpeg",
      alt: "Charcoal drawing of eyes with a red bindi",
    },
  },
  {
    title: "Cat",
    image: {
      src: "/artworks/061.jpg",
      alt: "Ink sketch of a cat's face",
    },
  },
  {
    title: "Cradled",
    image: {
      src: "/artworks/071.jpg",
      alt: "Pencil drawing of a newborn held in adult hands",
    },
  },
  {
    title: "Portrait Study",
    image: {
      src: "/artworks/081.jpg",
      alt: "Pencil portrait of a young woman",
    },
  },
  {
    title: "Eye Study",
    image: {
      src: "/artworks/091.jpeg",
      alt: "Graphite drawing of an eye",
    },
  },
  {
    title: "Dual Portrait",
    image: {
      src: "/artworks/101.jpg",
      alt: "Pencil drawing of two men",
    },
  },
  {
    title: "Who Wore It Better",
    image: {
      src: "/artworks/111.jpg",
      alt: "Drawing of a tabby cat in sunglasses",
    },
  },
  {
    title: "Portrait",
    image: {
      src: "/artworks/121.jpg",
      alt: "Realistic graphite portrait of a woman",
    },
  },
];
