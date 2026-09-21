"use client";

import { Book } from "@/components/Book";
import { Container } from "@/components/Container";
import type { BookItem } from "@/lib/content-types";

export function BooksPage({ books }: { books: BookItem[] }) {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Books</h1>
      <p className="text-muted-foreground mt-3 max-w-xl">
        A few titles that have stuck with me.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-12 py-6">
        {books.map((book) => (
          <Book
            key={book.title}
            image={book.coverImage.src}
            title={book.title}
            author={book.author}
            alt={book.coverImage.alt}
          />
        ))}
      </div>
    </Container>
  );
}
