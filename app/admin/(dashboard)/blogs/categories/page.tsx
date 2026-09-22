import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CategoryManager } from "@/components/admin/CategoryManager";
import { getAdminBlogCategories } from "@/lib/queries";

export default async function BlogCategoriesPage() {
  const categories = await getAdminBlogCategories();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/blogs"
          className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-4" />
          Blogs
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Create, rename, recolor, reorder, or delete categories. Renaming or
          deleting one updates every post that uses it.
        </p>
      </div>
      <CategoryManager categories={categories} />
    </div>
  );
}
