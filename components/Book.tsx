"use client";

import { motion, useReducedMotion } from "motion/react";

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

const spring = { type: "spring" as const, bounce: 0, duration: 0.6 };

/**
 * Port of Framer Book
 * https://framer.com/m/Book-AFRs.js@mxOP9zughWqzCr7yH17p
 */
export function Book({ image, title, author, alt }: BookProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="relative flex h-[305px] w-[200px] cursor-pointer items-center justify-center overflow-visible"
      initial="rest"
      whileHover={prefersReducedMotion ? "rest" : "hover"}
      animate="rest"
      variants={{
        rest: { boxShadow: restShadow },
        hover: { boxShadow: hoverShadow },
      }}
      transition={spring}
      aria-label={`${title} by ${author}`}
      role="img"
    >
      <motion.div
        className="relative flex h-full w-full flex-col items-center justify-center"
        style={{ transformStyle: "preserve-3d", transformPerspective: 1200 }}
        variants={{
          rest: { z: 0 },
          hover: { originX: 1, z: 50 },
        }}
        transition={spring}
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

        <motion.div
          className="absolute inset-0 z-[1] overflow-hidden"
          style={{ transformStyle: "preserve-3d" }}
          variants={{
            rest: { rotateY: 0, z: 0, originX: 0 },
            hover: { rotateY: -70, z: 10, originX: 0 },
          }}
          transition={spring}
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
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
