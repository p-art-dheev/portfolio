import type { Metadata } from "next";

import { BooksPage } from "@/components/BooksPage";

export const metadata: Metadata = {
  title: "Books",
  description: "Books I have been reading and returning to.",
};

export default function BooksRoute() {
  return <BooksPage />;
}
