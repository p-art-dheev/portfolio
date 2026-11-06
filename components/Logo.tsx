const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/**
 * Navbar wordmark: "pardheev" in the display serif + ".dev" in ink-blue
 * italic. On hover the full stop hops and an ink line draws underneath.
 * Put it inside a link with the `group/logo` class.
 */
export function Logo({ domain }: { domain: string }) {
  const dot = domain.indexOf(".");
  const name = dot > 0 ? domain.slice(0, dot) : domain;
  const tld = dot > 0 ? domain.slice(dot + 1) : "";

  return (
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
  );
}
