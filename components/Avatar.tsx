import Image from "next/image";

/** The portrait in the hero. One fixed image, rendered on the server. */
export function Avatar({ name }: { name: string }) {
  return (
    <div className="shrink-0 rounded-full shadow-[0_12px_28px_-14px_rgb(0_0_0/0.6)]">
      <Image
        src="/avatars/avatar.jpg"
        alt={`Portrait of ${name}`}
        width={128}
        height={128}
        priority
        fetchPriority="high"
        quality={75}
        sizes="128px"
        className="border-border size-28 rounded-full border object-cover sm:size-32"
      />
    </div>
  );
}
