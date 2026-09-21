import Link from "next/link";
import { BookOpen } from "lucide-react";

import { DeleteButton } from "@/components/admin/DeleteButton";
import { EmptyState } from "@/components/admin/EmptyState";
import { PageHeader } from "@/components/admin/PageHeader";
import { PublishBadge } from "@/components/admin/StatusBadge";
import { deleteBook } from "@/lib/admin/actions";
import { listAdminBooks } from "@/lib/queries";
import { Button } from "@/components/ui/button";

export default async function AdminBooksPage() {
  const books = await listAdminBooks();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Books"
        description="Titles on the books page."
        actionHref="/admin/books/new"
        actionLabel="New book"
      />
      {books.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No books yet"
          description="Add a cover and keep it as a draft until you are ready."
          href="/admin/books/new"
          action="Add book"
        />
      ) : (
        <ul className="space-y-3">
          {books.map((book) => (
            <li
              key={book.id}
              className="border-border flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1.5">
                <p className="font-medium tracking-tight">{book.title}</p>
                <p className="text-muted-foreground text-xs">{book.author}</p>
                <PublishBadge published={book.published} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/books/${book.id}`}>Edit</Link>
                </Button>
                <DeleteButton action={deleteBook} id={book.id} label="book" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
