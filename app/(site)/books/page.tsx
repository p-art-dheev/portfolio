import type { Metadata } from "next";

import { BooksPage } from "@/components/BooksPage";
import { getPublishedBooks } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Books",
  description: "Books I have been reading and returning to.",
};

export default async function BooksRoute() {
  const books = await getPublishedBooks();
  return <BooksPage books={books} />;
}
