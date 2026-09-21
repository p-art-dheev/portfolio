import Link from "next/link";

import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteBook } from "@/lib/admin/actions";
import { listAdminBooks } from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminBooksPage() {
  const books = await listAdminBooks();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Books</h1>
        <Button asChild>
          <Link href="/admin/books/new">New</Link>
        </Button>
      </div>
      <ul className="space-y-3">
        {books.map((book) => (
          <li
            key={book.id}
            className="border-border flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">{book.title}</p>
              <p className="text-muted-foreground text-xs">{book.author}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={book.published ? "default" : "secondary"}>
                {book.published ? "Published" : "Draft"}
              </Badge>
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/books/${book.id}`}>Edit</Link>
              </Button>
              <DeleteButton action={deleteBook} id={book.id} label="book" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
