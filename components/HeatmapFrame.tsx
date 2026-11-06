"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

// One formatter, created once; toLocaleDateString(..., options) builds a new
// Intl formatter on every call.
const dateFormat = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

function tooltipText(date: string, count: number) {
  const label =
    count === 0
      ? "No contributions"
      : `${count} contribution${count === 1 ? "" : "s"}`;
  return `${label} on ${dateFormat.format(new Date(`${date}T00:00:00`))}`;
}

type Tip = { text: string; x: number; y: number; arrowX: number };

/**
 * The interactive layer around the server-drawn GitHub calendar: a single
 * shared tooltip (event delegation over the tiles' data attributes), and on
 * narrow screens a sideways scroller that opens on the latest weeks, like
 * GitHub, until the visitor scrolls back through the year themselves.
 */
export function HeatmapFrame({
  weeks,
  children,
}: {
  weeks: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip | null>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  function showTip(target: EventTarget) {
    const wrapper = ref.current;
    if (!wrapper || !(target instanceof HTMLElement)) return;
    const date = target.dataset.d;
    if (!date) return;
    const box = wrapper.getBoundingClientRect();
    const tile = target.getBoundingClientRect();
    const centre = tile.left + tile.width / 2 - box.left;
    // Keep the bubble inside the section; the arrow still points at the tile.
    const half = (tipRef.current?.offsetWidth ?? 200) / 2;
    const x = Math.min(Math.max(centre, half), box.width - half);
    setTip({
      text: tooltipText(date, Number(target.dataset.c) || 0),
      x,
      y: tile.top - box.top - 8,
      arrowX: centre - x,
    });
  }

  useEffect(() => {
    const scroller = ref.current?.querySelector<HTMLElement>(".heatmap-scroll");
    if (!scroller) return;
    let userScrolled = false;

    const updateEdges = () => {
      const max = scroller.scrollWidth - scroller.clientWidth;
      const start = scroller.scrollLeft <= 1;
      const end = scroller.scrollLeft >= max - 1;
      setEdges((current) =>
        current.start === start && current.end === end
          ? current
          : { start, end },
      );
    };
    const pinToEnd = () => {
      if (!userScrolled) scroller.scrollLeft = scroller.scrollWidth;
      updateEdges();
    };
    const onUserScroll = () => {
      userScrolled = true;
    };

    pinToEnd();
    const resizes = new ResizeObserver(pinToEnd);
    resizes.observe(scroller);
    scroller.addEventListener("scroll", updateEdges, { passive: true });
    scroller.addEventListener("pointerdown", onUserScroll);
    scroller.addEventListener("wheel", onUserScroll, { passive: true });
    scroller.addEventListener("touchstart", onUserScroll, { passive: true });

    return () => {
      resizes.disconnect();
      scroller.removeEventListener("scroll", updateEdges);
      scroller.removeEventListener("pointerdown", onUserScroll);
      scroller.removeEventListener("wheel", onUserScroll);
      scroller.removeEventListener("touchstart", onUserScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="heatmap"
      style={{ "--weeks": weeks } as CSSProperties}
      data-at-start={edges.start || undefined}
      data-at-end={edges.end || undefined}
      onPointerOver={(e) => showTip(e.target)}
      onPointerLeave={() => setTip(null)}
      onScrollCapture={() => setTip(null)}
    >
      <div
        ref={tipRef}
        role="tooltip"
        className="heatmap-tooltip"
        data-open={tip ? "" : undefined}
        style={tip ? { left: tip.x, top: tip.y } : undefined}
      >
        {tip?.text}
        <span
          className="heatmap-tooltip-arrow"
          style={{ left: `calc(50% + ${tip?.arrowX ?? 0}px)` }}
        />
      </div>
      {children}
    </div>
  );
}
