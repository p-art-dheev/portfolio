import { PostForm } from "@/components/admin/PostForm";
import { getSiteSettings } from "@/lib/queries";

export default async function NewPostPage() {
  const site = await getSiteSettings();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New post</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Save as a draft any time. Nothing goes public until you press Publish.
        </p>
      </div>
      <PostForm site={site} />
    </div>
  );
}
