import { notFound } from "next/navigation";

import { BookForm } from "@/components/admin/BookForm";
import { getAdminBook } from "@/lib/queries";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getAdminBook(id);
  if (!book) notFound();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold tracking-tight">Edit book</h1>
      <BookForm book={book} />
    </div>
  );
}
