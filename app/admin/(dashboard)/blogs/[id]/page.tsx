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
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold tracking-tight">Edit post</h1>
      <PostForm post={post} />
    </div>
  );
}
