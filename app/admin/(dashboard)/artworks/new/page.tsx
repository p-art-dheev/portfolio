import { ArtworkForm } from "@/components/admin/ArtworkForm";

export default function NewArtworkPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold tracking-tight">New artwork</h1>
      <ArtworkForm />
    </div>
  );
}
