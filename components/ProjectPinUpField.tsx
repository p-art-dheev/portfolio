"use client";

import * as React from "react";

const FIELD_WIDTH = 8000;
const FIELD_HEIGHT = 5000;

const gradients = [
  ["#334A62", "#1F2A38"],
  ["#6A4A42", "#3F2A26"],
  ["#4B5A43", "#2F3A2C"],
  ["#455A5C", "#2A3637"],
  ["#5F5B56", "#383532"],
  ["#5E4B5C", "#352A36"],
  ["#3D4F68", "#222C3F"],
  ["#6A5F4E", "#3E382F"],
] as const;

export type PinUpItem = {
  title: string;
  image?: { src: string; alt?: string };
  link?: string;
};

type LaidOutItem = PinUpItem & {
  cardWidth: number;
  x: number;
  y: number;
  rotation: number;
  depth: number;
  gradientA: string;
  gradientB: string;
};

type ProjectPinUpFieldProps = {
  items?: PinUpItem[];
  placeholderCount?: number;
  overlapStrength?: number;
  backgroundColor?: string;
  showGrid?: boolean;
  gridOpacity?: number;
  cardRadius?: number;
  shadowStrength?: number;
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  enableHoverEffect?: boolean;
  cardSurface?: string;
  cardPadding?: number;
  labelColor?: string;
  hazeStrength?: number;
  parallaxStrength?: number;
  dragSpring?: number;
  cardBorderColor?: string;
};

type CardDragState = {
  active: boolean;
  cardIndex: number;
  startPointerX: number;
  startPointerY: number;
  startCardX: number;
  startCardY: number;
  hasMoved: boolean;
  dragLiveX: number;
  dragLiveY: number;
  dragDisplayX: number;
  dragDisplayY: number;
  dragRafId: number | null;
};

type CardResizeState = {
  active: boolean;
  cardIndex: number;
  corner: "tl" | "tr" | "bl" | "br";
  startPointerX: number;
  startWidth: number;
  startX: number;
  wrapperEl: HTMLElement | null;
};

function seededRandom(seed: number) {
  const x = Math.sin(seed * 999.177) * 1e4;
  return x - Math.floor(x);
}

function computeDepth(index: number) {
  return 0.15 + seededRandom(index * 37 + 5) * 0.85;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * Port of Framer ProjectPinUpField
 * https://framer.com/m/ProjectPinUpField-7siWFo.js@bT9NGtTbn1sjwprO4gzZ
 */
export function ProjectPinUpField({
  items,
  placeholderCount = 0,
  overlapStrength = 0.45,
  backgroundColor = "#0a0a0a",
  showGrid = false,
  gridOpacity = 0.18,
  cardRadius = 6,
  shadowStrength = 1,
  initialZoom = 0.7,
  minZoom = 0.12,
  maxZoom = 3.5,
  enableHoverEffect = true,
  cardSurface = "#ffffff",
  cardPadding = 8,
  labelColor = "#111111",
  hazeStrength = 0.4,
  parallaxStrength = 28,
  dragSpring = 0.18,
  cardBorderColor = "rgba(0,0,0,0.08)",
}: ProjectPinUpFieldProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const transformRafRef = React.useRef<number | null>(null);
  const inertiaRafRef = React.useRef<number | null>(null);
  const focusRafRef = React.useRef<number | null>(null);
  const txRef = React.useRef(0);
  const tyRef = React.useRef(0);
  const zoomRef = React.useRef(clamp(initialZoom, minZoom, maxZoom));
  const isDraggingRef = React.useRef(false);
  const pointerIdRef = React.useRef<number | null>(null);
  const lastPointerRef = React.useRef({ x: 0, y: 0, time: 0 });
  const velocityRef = React.useRef({ x: 0, y: 0 });
  const touchPinchRef = React.useRef({
    active: false,
    startDistance: 0,
    startZoom: zoomRef.current,
    midpointX: 0,
    midpointY: 0,
  });
  const lastTapRef = React.useRef(0);
  const cardDragRef = React.useRef<CardDragState | null>(null);
  const parallaxTargetRef = React.useRef({ x: 0, y: 0 });
  const parallaxCurrentRef = React.useRef({ x: 0, y: 0 });
  const mouseParallaxRafRef = React.useRef<number | null>(null);
  const dragSpringRef = React.useRef(dragSpring);
  const parallaxStrengthRef = React.useRef(parallaxStrength);
  const cardResizeRef = React.useRef<CardResizeState | null>(null);
  const isParallaxRunningRef = React.useRef(false);

  const [mounted, setMounted] = React.useState(false);
  const [hasHydrated, setHasHydrated] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [activeCard, setActiveCard] = React.useState<number | null>(null);
  const [cardOverrides, setCardOverrides] = React.useState<
    Record<number, { x: number; y: number }>
  >({});
  const [cardSizes, setCardSizes] = React.useState<
    Record<number, { width: number }>
  >({});

  const dataItems = React.useMemo<LaidOutItem[]>(() => {
    const sourceItems = items && items.length > 0 ? items : null;
    const count = sourceItems?.length ?? placeholderCount;
    const cols = Math.ceil(Math.sqrt(count * 1.6));
    const cellW = Math.round(600 - overlapStrength * 480);
    const cellH = Math.round(500 - overlapStrength * 400);

    return Array.from({ length: count }, (_, i) => {
      const item = sourceItems?.[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const jitterX = (seededRandom(i * 7 + 1) - 0.5) * 280;
      const jitterY = (seededRandom(i * 7 + 2) - 0.5) * 200;
      const w = 180 + Math.floor(seededRandom(i * 7 + 3) * 260);
      const rot = (seededRandom(i * 7 + 5) - 0.5) * 10;
      const depth = computeDepth(i);
      const gIdx = i % gradients.length;
      return {
        title: item?.title ?? `ITEM-${String(i + 1).padStart(3, "0")}`,
        image: item?.image,
        link: item?.link ?? "",
        cardWidth: w,
        x: Math.round(80 + col * cellW + jitterX),
        y: Math.round(80 + row * cellH + jitterY),
        rotation: rot,
        depth: Math.round(depth * 1000) / 1000,
        gradientA: gradients[gIdx][0],
        gradientB: gradients[gIdx][1],
      };
    });
  }, [items, placeholderCount, overlapStrength]);

  React.useEffect(() => {
    dragSpringRef.current = dragSpring;
    parallaxStrengthRef.current = parallaxStrength;
  }, [dragSpring, parallaxStrength]);

  const applyTransform = React.useCallback(() => {
    if (!canvasRef.current) return;
    canvasRef.current.style.transform = `translate(${txRef.current}px, ${tyRef.current}px) scale(${zoomRef.current})`;
  }, []);

  const cancelFocusAnimation = React.useCallback(() => {
    if (focusRafRef.current !== null) {
      window.cancelAnimationFrame(focusRafRef.current);
      focusRafRef.current = null;
    }
  }, []);

  const cancelInertia = React.useCallback(() => {
    if (inertiaRafRef.current !== null) {
      window.cancelAnimationFrame(inertiaRafRef.current);
      inertiaRafRef.current = null;
    }
  }, []);

  const scheduleTransform = React.useCallback(() => {
    if (transformRafRef.current !== null) return;
    transformRafRef.current = window.requestAnimationFrame(() => {
      transformRafRef.current = null;
      applyTransform();
    });
  }, [applyTransform]);

  const focusCard = React.useCallback(
    (card: LaidOutItem, targetZoom = 1.2) => {
      if (!containerRef.current) return;
      cancelFocusAnimation();
      cancelInertia();
      const rect = containerRef.current.getBoundingClientRect();
      const z0 = zoomRef.current;
      const tx0 = txRef.current;
      const ty0 = tyRef.current;
      const z1 = clamp(targetZoom, minZoom, maxZoom);
      const width = card.cardWidth ?? 280;
      const height = width * 0.7;
      const targetTx = rect.width / 2 - (card.x + width / 2) * z1;
      const targetTy = rect.height / 2 - (card.y + height / 2) * z1;
      const start = performance.now();
      const duration = 500;
      const tick = () => {
        const t = clamp((performance.now() - start) / duration, 0, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        zoomRef.current = lerp(z0, z1, ease);
        txRef.current = lerp(tx0, targetTx, ease);
        tyRef.current = lerp(ty0, targetTy, ease);
        applyTransform();
        if (t < 1) {
          focusRafRef.current = window.requestAnimationFrame(tick);
        } else {
          focusRafRef.current = null;
        }
      };
      focusRafRef.current = window.requestAnimationFrame(tick);
    },
    [applyTransform, cancelFocusAnimation, cancelInertia, maxZoom, minZoom],
  );

  const zoomAtPoint = React.useCallback(
    (clientX: number, clientY: number, nextZoom: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const z = clamp(nextZoom, minZoom, maxZoom);
      const localX = clientX - rect.left;
      const localY = clientY - rect.top;
      const worldX = (localX - txRef.current) / zoomRef.current;
      const worldY = (localY - tyRef.current) / zoomRef.current;
      zoomRef.current = z;
      txRef.current = localX - worldX * z;
      tyRef.current = localY - worldY * z;
      scheduleTransform();
    },
    [maxZoom, minZoom, scheduleTransform],
  );

  React.useEffect(() => {
    setHasHydrated(true);
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    zoomRef.current = clamp(initialZoom, minZoom, maxZoom);
    if (dataItems.length === 0) {
      txRef.current = rect.width / 2;
      tyRef.current = rect.height / 2;
      applyTransform();
      return;
    }
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const item of dataItems) {
      const width = item.cardWidth ?? 280;
      const height = width * 0.7;
      minX = Math.min(minX, item.x);
      minY = Math.min(minY, item.y);
      maxX = Math.max(maxX, item.x + width);
      maxY = Math.max(maxY, item.y + height);
    }
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    txRef.current = rect.width / 2 - centerX * zoomRef.current;
    tyRef.current = rect.height / 2 - centerY * zoomRef.current;
    applyTransform();
  }, [applyTransform, initialZoom, maxZoom, minZoom, dataItems]);

  React.useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const startParallaxLoop = () => {
      if (mouseParallaxRafRef.current !== null) return;
      isParallaxRunningRef.current = true;
      const tick = () => {
        if (!isParallaxRunningRef.current) {
          mouseParallaxRafRef.current = null;
          return;
        }
        const target = parallaxTargetRef.current;
        const curr = parallaxCurrentRef.current;
        const lx = curr.x + (target.x - curr.x) * 0.06;
        const ly = curr.y + (target.y - curr.y) * 0.06;
        parallaxCurrentRef.current = { x: lx, y: ly };
        const wrappers = canvasRef.current?.querySelectorAll<HTMLElement>(
          "[data-pinup-depth]",
        );
        wrappers?.forEach((el) => {
          const depth = parseFloat(el.dataset.pinupDepth ?? "0.5");
          const strength = parallaxStrengthRef.current;
          const ox = lx * strength * depth;
          const oy = ly * strength * depth;
          el.style.transform = `translate(${ox}px, ${oy}px)`;
        });
        mouseParallaxRafRef.current = window.requestAnimationFrame(tick);
      };
      mouseParallaxRafRef.current = window.requestAnimationFrame(tick);
    };

    const stopParallaxLoop = () => {
      isParallaxRunningRef.current = false;
      if (mouseParallaxRafRef.current !== null) {
        window.cancelAnimationFrame(mouseParallaxRafRef.current);
        mouseParallaxRafRef.current = null;
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-pinup-card='true']")) return;
      cancelFocusAnimation();
      cancelInertia();
      isDraggingRef.current = true;
      pointerIdRef.current = event.pointerId;
      node.setPointerCapture(event.pointerId);
      const now = performance.now();
      lastPointerRef.current = { x: event.clientX, y: event.clientY, time: now };
      velocityRef.current = { x: 0, y: 0 };
      React.startTransition(() => setDragging(true));
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isDraggingRef.current || pointerIdRef.current !== event.pointerId)
        return;
      const now = performance.now();
      const last = lastPointerRef.current;
      const dx = event.clientX - last.x;
      const dy = event.clientY - last.y;
      const dt = Math.max(1, now - last.time);
      txRef.current += dx;
      tyRef.current += dy;
      velocityRef.current = { x: dx / dt, y: dy / dt };
      lastPointerRef.current = { x: event.clientX, y: event.clientY, time: now };
      scheduleTransform();
    };

    const startInertia = () => {
      cancelInertia();
      const friction = 0.92;
      const minSpeed = 0.015;
      let prev = performance.now();
      const tick = () => {
        const now = performance.now();
        const dt = Math.max(1, now - prev);
        prev = now;
        velocityRef.current.x *= friction;
        velocityRef.current.y *= friction;
        txRef.current += velocityRef.current.x * dt;
        tyRef.current += velocityRef.current.y * dt;
        applyTransform();
        const speed = Math.hypot(velocityRef.current.x, velocityRef.current.y);
        if (speed > minSpeed) {
          inertiaRafRef.current = window.requestAnimationFrame(tick);
        } else {
          inertiaRafRef.current = null;
        }
      };
      inertiaRafRef.current = window.requestAnimationFrame(tick);
    };

    const onPointerUpOrCancel = (event: PointerEvent) => {
      if (pointerIdRef.current !== event.pointerId) return;
      isDraggingRef.current = false;
      pointerIdRef.current = null;
      try {
        node.releasePointerCapture(event.pointerId);
      } catch {
        /* already released */
      }
      React.startTransition(() => setDragging(false));
      startInertia();
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      cancelFocusAnimation();
      const factor = Math.exp(-event.deltaY * 0.0015);
      zoomAtPoint(event.clientX, event.clientY, zoomRef.current * factor);
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        cancelFocusAnimation();
        cancelInertia();
        const t1 = event.touches[0];
        const t2 = event.touches[1];
        const dx = t2.clientX - t1.clientX;
        const dy = t2.clientY - t1.clientY;
        touchPinchRef.current = {
          active: true,
          startDistance: Math.hypot(dx, dy),
          startZoom: zoomRef.current,
          midpointX: (t1.clientX + t2.clientX) / 2,
          midpointY: (t1.clientY + t2.clientY) / 2,
        };
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 2 || !touchPinchRef.current.active) return;
      event.preventDefault();
      const t1 = event.touches[0];
      const t2 = event.touches[1];
      const dx = t2.clientX - t1.clientX;
      const dy = t2.clientY - t1.clientY;
      const distance = Math.hypot(dx, dy);
      const pinch = touchPinchRef.current;
      const scale = distance / Math.max(1, pinch.startDistance);
      zoomAtPoint(pinch.midpointX, pinch.midpointY, pinch.startZoom * scale);
    };

    const onTouchEnd = () => {
      touchPinchRef.current.active = false;
    };

    const onMouseMove = (event: MouseEvent) => {
      if (isDraggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      parallaxTargetRef.current = {
        x: (event.clientX - rect.left) / rect.width - 0.5,
        y: (event.clientY - rect.top) / rect.height - 0.5,
      };
    };

    node.addEventListener("pointerdown", onPointerDown);
    node.addEventListener("pointermove", onPointerMove);
    node.addEventListener("pointerup", onPointerUpOrCancel);
    node.addEventListener("pointercancel", onPointerUpOrCancel);
    node.addEventListener("wheel", onWheel, { passive: false });
    node.addEventListener("touchstart", onTouchStart, { passive: true });
    node.addEventListener("touchmove", onTouchMove, { passive: false });
    node.addEventListener("touchend", onTouchEnd);
    node.addEventListener("touchcancel", onTouchEnd);
    node.addEventListener("mousemove", onMouseMove);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) startParallaxLoop();
          else stopParallaxLoop();
        });
      },
      { threshold: 0 },
    );
    observer.observe(node);

    return () => {
      node.removeEventListener("pointerdown", onPointerDown);
      node.removeEventListener("pointermove", onPointerMove);
      node.removeEventListener("pointerup", onPointerUpOrCancel);
      node.removeEventListener("pointercancel", onPointerUpOrCancel);
      node.removeEventListener("wheel", onWheel);
      node.removeEventListener("touchstart", onTouchStart);
      node.removeEventListener("touchmove", onTouchMove);
      node.removeEventListener("touchend", onTouchEnd);
      node.removeEventListener("touchcancel", onTouchEnd);
      node.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
      stopParallaxLoop();
    };
  }, [
    cancelFocusAnimation,
    cancelInertia,
    zoomAtPoint,
    scheduleTransform,
    applyTransform,
  ]);

  React.useEffect(() => {
    return () => {
      if (transformRafRef.current !== null)
        window.cancelAnimationFrame(transformRafRef.current);
      if (inertiaRafRef.current !== null)
        window.cancelAnimationFrame(inertiaRafRef.current);
      if (focusRafRef.current !== null)
        window.cancelAnimationFrame(focusRafRef.current);
      if (mouseParallaxRafRef.current !== null)
        window.cancelAnimationFrame(mouseParallaxRafRef.current);
    };
  }, []);

  const onCardTouchEnd = React.useCallback((item: LaidOutItem) => {
    const now = Date.now();
    if (now - lastTapRef.current < 280) {
      if (item.link) window.open(item.link, "_blank", "noopener,noreferrer");
    }
    lastTapRef.current = now;
  }, []);

  const corners = ["tl", "tr", "bl", "br"] as const;
  const cursorMap = {
    tl: "nw-resize",
    tr: "ne-resize",
    bl: "sw-resize",
    br: "se-resize",
  } as const;
  const charMap = { tl: "↖", tr: "↗", bl: "↙", br: "↘" } as const;

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: backgroundColor,
        cursor: dragging ? "grabbing" : "grab",
        touchAction: "none",
        userSelect: "none",
      }}
    >
      {showGrid && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: gridOpacity,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.38) 1px, rgba(255,255,255,0) 1.2px)",
            backgroundSize: "22px 22px",
            backgroundPosition: "0 0",
          }}
        />
      )}
      <div style={{ position: "absolute", inset: 0 }}>
        <div
          ref={canvasRef}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: FIELD_WIDTH,
            height: FIELD_HEIGHT,
            transformOrigin: "0 0",
            willChange: "transform",
          }}
        >
          {hasHydrated &&
            dataItems.map((item, index) => {
            const override = cardOverrides[index];
            const cardX = override ? override.x : item.x;
            const cardY = override ? override.y : item.y;
            const effectiveWidth =
              cardSizes[index]?.width ?? item.cardWidth ?? 280;
            const hasImage = Boolean(item.image?.src);
            const gradientA = item.gradientA;
            const gradientB = item.gradientB;

            return (
              <div
                key={`wrapper-${item.title}-${index}`}
                data-pinup-card="true"
                data-pinup-depth={String(item.depth)}
                className="pointer-events-none"
                style={{
                  position: "absolute",
                  left: `${cardX}px`,
                  top: `${cardY}px`,
                  width: `${effectiveWidth}px`,
                }}
              >
                <button
                  type="button"
                  aria-label={`Open ${item.title}`}
                  onDoubleClick={() => focusCard(item, 1.2)}
                  onTouchEnd={() => onCardTouchEnd(item)}
                  onMouseEnter={() =>
                    React.startTransition(() => setActiveCard(index))
                  }
                  onMouseLeave={() =>
                    React.startTransition(() => setActiveCard(null))
                  }
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    const currentX = cardOverrides[index]?.x ?? item.x;
                    const currentY = cardOverrides[index]?.y ?? item.y;
                    const wrapperEl = e.currentTarget.parentElement;
                    cardDragRef.current = {
                      active: true,
                      cardIndex: index,
                      startPointerX: e.clientX,
                      startPointerY: e.clientY,
                      startCardX: currentX,
                      startCardY: currentY,
                      hasMoved: false,
                      dragLiveX: currentX,
                      dragLiveY: currentY,
                      dragDisplayX: currentX,
                      dragDisplayY: currentY,
                      dragRafId: null,
                    };
                    const startDragSpring = (
                      cardIndex: number,
                      el: HTMLElement,
                    ) => {
                      const springTick = () => {
                        const drag = cardDragRef.current;
                        if (!drag || drag.cardIndex !== cardIndex) return;
                        drag.dragDisplayX +=
                          (drag.dragLiveX - drag.dragDisplayX) *
                          dragSpringRef.current;
                        drag.dragDisplayY +=
                          (drag.dragLiveY - drag.dragDisplayY) *
                          dragSpringRef.current;
                        el.style.left = `${drag.dragDisplayX}px`;
                        el.style.top = `${drag.dragDisplayY}px`;
                        drag.dragRafId =
                          window.requestAnimationFrame(springTick);
                      };
                      if (cardDragRef.current) {
                        cardDragRef.current.dragRafId =
                          window.requestAnimationFrame(springTick);
                      }
                    };
                    if (wrapperEl) startDragSpring(index, wrapperEl);
                    e.currentTarget.setPointerCapture(e.pointerId);
                    e.currentTarget.style.transition = "none";
                    e.currentTarget.style.zIndex = "50";
                    e.currentTarget.style.cursor = "grabbing";
                  }}
                  onPointerMove={(e) => {
                    if (
                      !cardDragRef.current ||
                      cardDragRef.current.cardIndex !== index
                    )
                      return;
                    const dx =
                      (e.clientX - cardDragRef.current.startPointerX) /
                      zoomRef.current;
                    const dy =
                      (e.clientY - cardDragRef.current.startPointerY) /
                      zoomRef.current;
                    if (
                      !cardDragRef.current.hasMoved &&
                      Math.hypot(dx, dy) > 5
                    ) {
                      cardDragRef.current.hasMoved = true;
                    }
                    if (cardDragRef.current.hasMoved) {
                      cardDragRef.current.dragLiveX =
                        cardDragRef.current.startCardX + dx;
                      cardDragRef.current.dragLiveY =
                        cardDragRef.current.startCardY + dy;
                    }
                  }}
                  onPointerUp={(e) => {
                    if (
                      !cardDragRef.current ||
                      cardDragRef.current.cardIndex !== index
                    )
                      return;
                    const drag = cardDragRef.current;
                    if (drag.dragRafId !== null) {
                      window.cancelAnimationFrame(drag.dragRafId);
                    }
                    cardDragRef.current = null;
                    e.currentTarget.releasePointerCapture(e.pointerId);
                    e.currentTarget.style.transition = "";
                    e.currentTarget.style.zIndex = "";
                    e.currentTarget.style.cursor = "grab";
                    if (drag.hasMoved) {
                      React.startTransition(() =>
                        setCardOverrides((prev) => ({
                          ...prev,
                          [index]: { x: drag.dragDisplayX, y: drag.dragDisplayY },
                        })),
                      );
                    } else if (item.link) {
                      window.open(item.link, "_blank", "noopener,noreferrer");
                    }
                  }}
                  onPointerCancel={(e) => {
                    if (
                      !cardDragRef.current ||
                      cardDragRef.current.cardIndex !== index
                    )
                      return;
                    if (cardDragRef.current.dragRafId !== null) {
                      window.cancelAnimationFrame(cardDragRef.current.dragRafId);
                    }
                    cardDragRef.current = null;
                    e.currentTarget.style.transition = "";
                    e.currentTarget.style.zIndex = "";
                    e.currentTarget.style.cursor = "grab";
                  }}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "auto",
                    padding: 0,
                    borderRadius: cardRadius,
                    overflow: "hidden",
                    border: `1px solid ${cardBorderColor}`,
                    background: cardSurface,
                    textAlign: "left",
                    transform: `scale(${enableHoverEffect && activeCard === index ? 1.03 : 1})`,
                    transformOrigin: "center center",
                    opacity: mounted ? 1 : 0,
                    transitionDelay: `${index * 30}ms`,
                    transition:
                      "opacity 500ms ease, transform 220ms ease, box-shadow 220ms ease, filter 220ms ease, z-index 120ms ease",
                    filter:
                      enableHoverEffect && activeCard === index
                        ? "brightness(1.08)"
                        : "brightness(1)",
                    boxShadow:
                      enableHoverEffect && activeCard === index
                        ? `0 ${20 * shadowStrength}px ${60 * shadowStrength}px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.12)`
                        : `0 ${8 * shadowStrength}px ${24 * shadowStrength}px rgba(0,0,0,0.45)`,
                    zIndex: activeCard === index ? 20 : 1,
                    cursor: item.link ? "pointer" : "grab",
                    pointerEvents: "all",
                  }}
                >
                  <div
                    style={{
                      margin: `${cardPadding}px ${cardPadding}px 0 ${cardPadding}px`,
                      borderRadius: Math.max(0, cardRadius - cardPadding),
                      overflow: "hidden",
                      lineHeight: 0,
                      background: `linear-gradient(145deg, ${gradientA}, ${gradientB})`,
                    }}
                  >
                    {hasImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image!.src}
                        alt={item.image?.alt || item.title}
                        style={{
                          width: "100%",
                          height: "auto",
                          display: "block",
                          pointerEvents: "none",
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      padding: `6px ${cardPadding}px 8px ${cardPadding}px`,
                      color: labelColor,
                      fontFamily: "'Courier New', Courier, monospace",
                      fontSize: "11px",
                      fontWeight: 400,
                      lineHeight: "1.3em",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      pointerEvents: "none",
                    }}
                  >
                    {item.title.replace(/\s+/g, "-").toLowerCase()}.png
                  </div>
                </button>
                {corners.map((corner) => {
                  const isTop = corner === "tl" || corner === "tr";
                  const isLeft = corner === "tl" || corner === "bl";
                  return (
                    <div
                      key={corner}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        const currentOverride = cardOverrides[index];
                        const currentX = currentOverride
                          ? currentOverride.x
                          : item.x;
                        cardResizeRef.current = {
                          active: true,
                          cardIndex: index,
                          corner,
                          startPointerX: e.clientX,
                          startWidth: effectiveWidth,
                          startX: currentX,
                          wrapperEl: e.currentTarget.parentElement,
                        };
                        e.currentTarget.setPointerCapture(e.pointerId);
                      }}
                      onPointerMove={(e) => {
                        const r = cardResizeRef.current;
                        if (!r || r.cardIndex !== index) return;
                        const dx =
                          (e.clientX - r.startPointerX) / zoomRef.current;
                        let newW = r.startWidth;
                        let newX = r.startX;
                        if (r.corner === "br" || r.corner === "tr") {
                          newW = r.startWidth + dx;
                        } else {
                          newW = r.startWidth - dx;
                          newX = r.startX + dx;
                        }
                        newW = Math.max(80, Math.min(800, newW));
                        if (r.wrapperEl) {
                          r.wrapperEl.style.width = `${newW}px`;
                          if (r.corner === "tl" || r.corner === "bl") {
                            r.wrapperEl.style.left = `${newX}px`;
                          }
                        }
                      }}
                      onPointerUp={(e) => {
                        const r = cardResizeRef.current;
                        if (!r || r.cardIndex !== index) return;
                        const dx =
                          (e.clientX - r.startPointerX) / zoomRef.current;
                        let newW = r.startWidth;
                        let newX = r.startX;
                        if (r.corner === "br" || r.corner === "tr") {
                          newW = r.startWidth + dx;
                        } else {
                          newW = r.startWidth - dx;
                          newX = r.startX + dx;
                        }
                        newW = Math.max(80, Math.min(800, newW));
                        e.currentTarget.releasePointerCapture(e.pointerId);
                        cardResizeRef.current = null;
                        React.startTransition(() => {
                          setCardSizes((prev) => ({
                            ...prev,
                            [index]: { width: newW },
                          }));
                          if (r.corner === "tl" || r.corner === "bl") {
                            setCardOverrides((prev) => ({
                              ...prev,
                              [index]: {
                                x: newX,
                                y: prev[index]?.y ?? item.y,
                              },
                            }));
                          }
                        });
                      }}
                      style={{
                        position: "absolute",
                        top: isTop ? -9 : undefined,
                        bottom: !isTop ? -9 : undefined,
                        left: isLeft ? -9 : undefined,
                        right: !isLeft ? -9 : undefined,
                        width: 18,
                        height: 18,
                        cursor: cursorMap[corner],
                        zIndex: 30,
                        pointerEvents: "all",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 150ms",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "0";
                      }}
                    >
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.18)",
                          border: "1px solid rgba(255,255,255,0.5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 7,
                          color: "#fff",
                          lineHeight: 1,
                        }}
                      >
                        {charMap[corner]}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        {hazeStrength > 0 && (
          <div
            className="pointer-events-none"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 50,
              background: `radial-gradient(ellipse at center, transparent 15%, rgba(0,0,0,${hazeStrength * 0.75}) 100%)`,
            }}
          />
        )}
      </div>
    </div>
  );
}
