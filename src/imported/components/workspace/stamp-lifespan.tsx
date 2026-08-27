"use client";

import { Lifespan } from "./lifespan";

interface StampLifespanProps {
  initialUsed: number;
  initialRated: number;
  className?: string;
}

/**
 * A stamp lifespan component showing stamps used vs rated life.
 * Built on the generic Lifespan component.
 */
export function StampLifespan({
  initialUsed,
  initialRated,
  className,
}: StampLifespanProps) {
  return (
    <Lifespan
      label="Stamp lifespan"
      initialCurrent={initialUsed}
      initialTotal={initialRated}
      unit="stamps"
      currentLabel="Stamps used"
      totalLabel="Rated life (total)"
      className={className}
    />
  );
}
