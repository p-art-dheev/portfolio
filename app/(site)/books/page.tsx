import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { BooksPage } from "@/components/BooksPage";
import { getPublishedBooks } from "@/lib/queries";
import { BASE_OPEN_GRAPH } from "@/lib/seo";
import { booksJsonLd } from "@/lib/structured-data";

const DESCRIPTION =
  "Books on philosophy, psychology, and productivity that Pardheev has been reading and returning to.";

export const metadata: Metadata = {
  title: "Books",
  description: DESCRIPTION,
  alternates: { canonical: "/books" },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    title: "Books",
    description: DESCRIPTION,
    url: "/books",
  },
  twitter: {
    card: "summary_large_image",
    title: "Books",
    description: DESCRIPTION,
  },
};

export default async function BooksRoute() {
  const books = await getPublishedBooks();
  return (
    <>
      <JsonLd data={booksJsonLd(books)} />
      <BooksPage books={books} />
    </>
  );
}
