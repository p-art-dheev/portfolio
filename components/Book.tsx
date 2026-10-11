import type { CSSProperties } from "react";

type BookProps = {
  image: string;
  title: string;
  author: string;
  alt?: string;
};

const restShadow =
  "0px 0.7px 0.7px -0.625px rgba(0, 0, 0, 0), 0px 1.8px 1.8px -1.25px rgba(0, 0, 0, 0), 0px 3.6px 3.6px -1.875px rgba(0, 0, 0, 0), 0px 6.9px 6.9px -2.5px rgba(0, 0, 0, 0), 0px 13.6px 13.6px -3.125px rgba(0, 0, 0, 0), 0px 30px 30px -3.75px rgba(0, 0, 0, 0)";

const hoverShadow =
  "0px 0.7px 0.7px -0.625px rgba(0, 0, 0, 0.44), 0px 1.8px 1.8px -1.25px rgba(0, 0, 0, 0.43), 0px 3.6px 3.6px -1.875px rgba(0, 0, 0, 0.41), 0px 6.9px 6.9px -2.5px rgba(0, 0, 0, 0.38), 0px 13.6px 13.6px -3.125px rgba(0, 0, 0, 0.31), 0px 30px 30px -3.75px rgba(0, 0, 0, 0.15)";

// Approximates the old zero-bounce 0.6s spring.
const ease = "duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

/**
 * Port of Framer Book
 * https://framer.com/m/Book-AFRs.js@mxOP9zughWqzCr7yH17p
 */
export function Book({ image, title, author, alt }: BookProps) {
  // Plain CSS 3D transforms on hover (motion-safe only), so the Books page
  // doesn't need the motion library. Server-rendered, no client JS.
  return (
    <div
      className={`group relative flex h-[305px] w-[200px] cursor-pointer items-center justify-center overflow-visible [box-shadow:var(--book-rest)] transition-shadow motion-safe:hover:[box-shadow:var(--book-hover)] ${ease}`}
      style={
        {
          "--book-rest": restShadow,
          "--book-hover": hoverShadow,
        } as CSSProperties
      }
      aria-label={`${title} by ${author}`}
      role="img"
    >
      <div
        className={`relative flex h-full w-full flex-col items-center justify-center transition-transform [transform-style:preserve-3d] [transform:perspective(1200px)_translateZ(0)] motion-safe:group-hover:origin-right motion-safe:group-hover:[transform:perspective(1200px)_translateZ(50px)] ${ease}`}
      >
        <div
          className="relative z-0 flex h-full w-full flex-col items-center justify-center gap-2.5 overflow-hidden px-[30px]"
          style={{
            background:
              "linear-gradient(239deg, rgb(255, 255, 255) 0%, rgb(224, 224, 224) 100%)",
          }}
        >
          <p className="w-full text-center text-[20px] font-bold leading-tight text-black">
            {title}
          </p>
          <p className="w-full text-center text-xs text-black/30">{author}</p>
        </div>

        <div
          className={`absolute inset-0 z-[1] origin-left overflow-hidden transition-transform [transform-style:preserve-3d] [transform:rotateY(0deg)_translateZ(0)] motion-safe:group-hover:[transform:rotateY(-70deg)_translateZ(10px)] ${ease}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={alt || title}
            className="h-full w-full object-cover"
            draggable={false}
          />
          <div
            className="absolute inset-y-0 left-0 z-[1] w-[18px]"
            style={{
              background:
                "linear-gradient(90deg, rgb(0, 0, 0) 0%, rgb(255, 255, 255) 24%, rgb(0, 0, 0) 40%, rgb(255, 255, 255) 48%, rgba(255, 255, 255, 0) 100%)",
              opacity: 0.2,
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background:
                "linear-gradient(38deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%)",
            }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
