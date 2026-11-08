import Image from "next/image";

/** The portrait in the hero. One fixed image, rendered on the server. */
export function Avatar({ name }: { name: string }) {
  return (
    <div className="bezel shrink-0">
      <Image
        src="/avatars/avatar.jpg"
        alt={`Portrait of ${name}`}
        width={128}
        height={128}
        priority
        fetchPriority="high"
        quality={75}
        sizes="128px"
        className="size-28 rounded-full border border-black/35 object-cover sm:size-32"
      />
    </div>
  );
}
