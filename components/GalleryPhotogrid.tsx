"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

import { cn } from "@/lib/utils";

export type GalleryPhoto = {
  src: string;
  alt: string;
  title: string;
  width: number;
  height: number;
};

type GalleryPhotogridProps = {
  photos: GalleryPhoto[];
};

/**
 * Port of Framer Gallery Photogrid
 * https://framer.com/m/Gallery-Photogrid-crozuu.js@JJ6gn9Gf5EscbtKIOWTB
 */
export function GalleryPhotogrid({ photos }: GalleryPhotogridProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [sectionShown, setSectionShown] = useState(false);
  const [lbIndex, setLbIndex] = useState<number | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setSectionShown(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="w-full">
      <div
        className={cn(
          "w-full transition-[opacity,transform] duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)]",
          sectionShown
            ? "translate-y-0 opacity-100"
            : "translate-y-6 opacity-0",
        )}
        style={{ transitionDelay: sectionShown ? "0.35s" : "0s" }}
      >
        <div className="[column-count:1] [column-gap:16px] sm:[column-count:2]">
          {photos.map((photo, i) => (
            <GridItem
              key={photo.src}
              photo={photo}
              index={i}
              shown={sectionShown}
              onOpen={() => setLbIndex(i)}
            />
          ))}
        </div>
      </div>

      {lbIndex !== null && typeof document !== "undefined"
        ? createPortal(
            <Lightbox
              photos={photos}
              idx={lbIndex}
              onClose={() => setLbIndex(null)}
              onPrev={() => setLbIndex((i) => Math.max(0, (i ?? 0) - 1))}
              onNext={() =>
                setLbIndex((i) => Math.min(photos.length - 1, (i ?? 0) + 1))
              }
            />,
            document.body,
          )
        : null}
    </div>
  );
}

function GridItem({
  photo,
  index,
  shown,
  onOpen,
}: {
  photo: GalleryPhoto;
  index: number;
  shown: boolean;
  onOpen: () => void;
}) {
  const [hov, setHov] = useState(false);
  const delay = index * 0.06;

  return (
    <button
      type="button"
      onClick={() => {
        onOpen();
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={cn(
        "relative mb-4 block w-full cursor-pointer overflow-hidden break-inside-avoid rounded-[2px] border-0 bg-transparent p-0 text-left",
        "transition-[opacity,transform] duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)]",
        shown ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
      )}
      style={{ transitionDelay: shown ? `${delay}s` : "0s" }}
      aria-label={`Open ${photo.title}`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 28vw"
        quality={85}
        className="block h-auto w-full origin-center object-cover will-change-transform"
        style={{
          transform: hov ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 flex items-end p-5"
        style={{
          background: "rgba(0,0,0,0.45)",
          opacity: hov ? 1 : 0,
          transition: "opacity 0.35s ease",
        }}
      >
        <span
          className="font-sans text-sm tracking-[0.06em] text-white uppercase"
          style={{
            transform: hov ? "translateY(0)" : "translateY(8px)",
            transition: "transform 0.35s ease",
          }}
        >
          {photo.title}
        </span>
      </div>
    </button>
  );
}

function Lightbox({
  photos,
  idx,
  onClose,
  onPrev,
  onNext,
}: {
  photos: GalleryPhoto[];
  idx: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const photo = photos[idx];
  const hasPrev = idx > 0;
  const hasNext = idx < photos.length - 1;

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onPrev, onNext]);

  useEffect(() => {
    const t = window.setTimeout(() => setOpen(true), 40);
    return () => window.clearTimeout(t);
  }, []);

  function handleClose() {
    setClosing(true);
    setOpen(false);
    window.setTimeout(onClose, 400);
  }

  if (!photo) return null;

  const visible = open && !closing;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[99999] flex items-center justify-center isolate"
      style={{
        background: "rgba(0,0,0,0.94)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
        backdropFilter: visible ? "blur(6px)" : "none",
      }}
    >
      <div className="relative z-[1] flex max-h-[100dvh] w-screen max-w-[100vw] items-center justify-center">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (hasPrev) onPrev();
          }}
          className="hidden shrink-0 items-center border-0 bg-transparent px-5 sm:flex"
          style={{
            cursor: hasPrev ? "pointer" : "default",
            opacity: hasPrev ? 0.7 : 0.15,
          }}
          aria-label="Previous"
        >
          <Arrow dir="left" />
        </button>

        <div
          className="relative flex min-w-0 flex-1 items-center justify-center"
          style={{
            transform: visible ? "scale(1)" : "scale(0.92)",
            transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div
            className="relative inline-block"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="80vw"
              quality={90}
              priority
              className="block h-auto max-h-[70dvh] w-auto max-w-[84vw] rounded-[2px] object-contain sm:max-h-[76dvh] sm:max-w-[72vw]"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="absolute top-0 hidden items-center justify-center border-0 bg-transparent p-1 opacity-70 sm:flex"
              style={{ left: "calc(100% + 12px)" }}
              aria-label="Close"
            >
              <CloseX />
            </button>
            <div className="absolute top-[calc(100%+16px)] left-0 right-0 flex items-center justify-start">
              <span className="text-[13px] font-medium tracking-[0.15em] text-white uppercase">
                {photo.title}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (hasNext) onNext();
          }}
          className="hidden shrink-0 items-center border-0 bg-transparent px-5 sm:flex"
          style={{
            cursor: hasNext ? "pointer" : "default",
            opacity: hasNext ? 0.7 : 0.15,
          }}
          aria-label="Next"
        >
          <Arrow dir="right" />
        </button>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (hasPrev) onPrev();
        }}
        className="absolute top-1/2 left-2 flex -translate-y-1/2 items-center justify-center border-0 bg-transparent p-2 sm:hidden"
        style={{ opacity: hasPrev ? 0.7 : 0.15 }}
        aria-label="Previous"
      >
        <Arrow dir="left" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (hasNext) onNext();
        }}
        className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center justify-center border-0 bg-transparent p-2 sm:hidden"
        style={{ opacity: hasNext ? 0.7 : 0.15 }}
        aria-label="Next"
      >
        <Arrow dir="right" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        className="absolute top-5 right-5 flex items-center justify-center border-0 bg-transparent p-1.5 opacity-70 sm:hidden"
        aria-label="Close"
      >
        <CloseX />
      </button>

      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] tracking-[0.12em] text-white/35">
        {idx + 1} / {photos.length}
      </div>
    </div>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  const d = dir === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6";
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={d}
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseX() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
