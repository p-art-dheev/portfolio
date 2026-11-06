import { PV_MARK_PATH } from "@/lib/pv-mark";

/** The PV monogram tile, drawn in the current theme's paper and ink. */
function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={className}>
      <rect
        x="1"
        y="1"
        width="62"
        height="62"
        rx="15"
        className="fill-background stroke-border"
        strokeWidth="2"
      />
      <path
        d={PV_MARK_PATH}
        className="fill-foreground stroke-foreground"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/**
 * Navbar wordmark: PV mark + "pardheev" in the display serif + ".dev" in
 * ink-blue italic. On hover the mark tilts, the full stop hops and an ink
 * line draws underneath. Put it inside a link with the `group/logo` class.
 */
export function Logo({ domain }: { domain: string }) {
  const dot = domain.indexOf(".");
  const name = dot > 0 ? domain.slice(0, dot) : domain;
  const tld = dot > 0 ? domain.slice(dot + 1) : "";

  return (
    <span className="flex items-center gap-2.5">
      <Mark
        className={`size-7 shrink-0 transition-transform duration-500 ${ease} group-hover/logo:-rotate-6 motion-reduce:transition-none`}
      />
      <span className="font-display relative flex items-baseline text-[1.6rem] leading-none">
        {name}
        {tld ? (
          <>
            <span
              className={`text-link inline-block transition-transform duration-300 ${ease} group-hover/logo:-translate-y-1 motion-reduce:transition-none`}
            >
              .
            </span>
            <span className="text-link italic">{tld}</span>
          </>
        ) : null}
        <span
          aria-hidden
          className={`bg-link absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 ${ease} group-hover/logo:scale-x-100`}
        />
      </span>
    </span>
  );
}
