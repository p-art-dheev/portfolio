import { notFound } from "next/navigation";

import { PostForm } from "@/components/admin/PostForm";
import { getAdminPost } from "@/lib/queries";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getAdminPost(id);
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit post</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {post.published ? "This post is live." : "This post is still a draft."}
        </p>
      </div>
      <PostForm post={post} />
    </div>
  );
}
