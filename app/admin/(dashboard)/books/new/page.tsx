import { BookForm } from "@/components/admin/BookForm";

export default function NewBookPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold tracking-tight">New book</h1>
      <BookForm />
    </div>
  );
}
