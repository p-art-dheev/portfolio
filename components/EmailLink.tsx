"use client";

import { useEffect, useState, type ComponentProps } from "react";

type EmailLinkProps = Omit<ComponentProps<"a">, "href"> & {
  /** The address, base64 encoded so it isn't in the HTML as plain text. */
  encoded: string;
};

/**
 * Light spam protection: the mailto link is only built in the browser, so
 * scrapers reading the server HTML don't see the address.
 */
export function EmailLink({ encoded, ...props }: EmailLinkProps) {
  const [href, setHref] = useState<string>();

  useEffect(() => {
    try {
      setHref(`mailto:${atob(encoded)}`);
    } catch {
      // Leave the link inert if the value is malformed.
    }
  }, [encoded]);

  return <a {...props} href={href ?? "#contact"} />;
}
