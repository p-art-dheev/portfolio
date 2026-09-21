import { PostForm } from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New post</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Draft first. Publish when it is ready.
        </p>
      </div>
      <PostForm />
    </div>
  );
}
