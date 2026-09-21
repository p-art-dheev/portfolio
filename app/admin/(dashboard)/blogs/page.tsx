import Link from "next/link";

import { DeleteButton } from "@/components/admin/DeleteButton";
import { deletePost } from "@/lib/admin/actions";
import { listAdminPosts } from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminBlogsPage() {
  const posts = await listAdminPosts();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Blogs</h1>
        <Button asChild>
          <Link href="/admin/blogs/new">New</Link>
        </Button>
      </div>
      <ul className="space-y-3">
        {posts.map((post) => (
          <li
            key={post.id}
            className="border-border flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">{post.title}</p>
              <p className="text-muted-foreground text-xs">{post.slug}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={post.published ? "default" : "secondary"}>
                {post.published ? "Published" : "Draft"}
              </Badge>
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/blogs/${post.id}`}>Edit</Link>
              </Button>
              <DeleteButton action={deletePost} id={post.id} label="post" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
