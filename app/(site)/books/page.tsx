import type { Metadata } from "next";

import { BooksPage } from "@/components/BooksPage";
import { getPublishedBooks } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Books",
  description:
    "Books on philosophy, psychology, and productivity that Pardheev has been reading and returning to.",
  alternates: { canonical: "/books" },
  openGraph: { title: "Books", url: "/books" },
};

export default async function BooksRoute() {
  const books = await getPublishedBooks();
  return <BooksPage books={books} />;
}
