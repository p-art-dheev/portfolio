import Image from "next/image";

/** The portrait in the hero. One fixed image, rendered on the server. */
export function Avatar({ name }: { name: string }) {
  return (
    <div className="border-border bg-background ring-foreground/10 ring-offset-background shrink-0 rounded-full border-2 p-1 shadow-sm ring-2 ring-offset-2">
      <Image
        src="/avatars/avatar.jpg"
        alt={`Portrait of ${name}`}
        width={128}
        height={128}
        priority
        fetchPriority="high"
        quality={75}
        sizes="128px"
        className="border-border/70 size-28 rounded-full border object-cover sm:size-32"
      />
    </div>
  );
}
