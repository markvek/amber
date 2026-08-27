"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

/** A blank, editable page title — the headline field of a template (e.g. the machine name). */
export function EditableTitle({
  placeholder,
  className,
}: {
  placeholder: string;
  className?: string;
}) {
  const [value, setValue] = useState("");
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className={cn(
        "w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-muted-foreground/40",
        className
      )}
    />
  );
}

/** A blank, editable inline value — pairs with a static label in a record row. */
export function EditableField({
  placeholder,
  align = "right",
}: {
  placeholder: string;
  align?: "left" | "right";
}) {
  const [value, setValue] = useState("");
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className={cn(
        "min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:font-normal placeholder:text-muted-foreground/50",
        align === "right" ? "text-right" : "text-left"
      )}
    />
  );
}

/** Empty skeleton rows standing in for a not-yet-filled list (checks, records, people). */
export function PlaceholderRows({ count }: { count: number }) {
  return (
    <ul className="mt-2.5 space-y-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="flex items-center gap-2">
          <span className="size-3.5 shrink-0 rounded-full border border-dashed border-muted-foreground/30" />
          <span className="h-2 flex-1 rounded bg-muted" />
        </li>
      ))}
    </ul>
  );
}

/** A flat, empty bar chart placeholder. */
export function EmptyBars() {
  return (
    <div className="mt-3 flex h-16 items-end gap-1.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex-1 rounded-t-sm bg-muted" style={{ height: "35%" }} />
      ))}
    </div>
  );
}
