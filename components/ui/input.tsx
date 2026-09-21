import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-11 w-full min-w-0 rounded-lg border px-3 text-base outline-none transition-colors focus-visible:ring-3 disabled:opacity-50 sm:h-9 sm:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
