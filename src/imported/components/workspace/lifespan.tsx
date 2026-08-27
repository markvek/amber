"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface LifespanProps {
  /** Label shown above the metric */
  label: string;
  /** Initial current/used value */
  initialCurrent: number;
  /** Initial total/rated value */
  initialTotal: number;
  /** Unit name (e.g., "stamps", "cycles", "hours") */
  unit: string;
  /** Label for current value in edit form */
  currentLabel?: string;
  /** Label for total value in edit form */
  totalLabel?: string;
  /** Color class for progress bar */
  progressColor?: string;
  /** Additional class names */
  className?: string;
  /** Format function for displaying values */
  formatValue?: (value: number) => string;
}

/**
 * A generic lifespan/progress component showing current vs total with a progress bar.
 * Editable via popover. Use for stamps, cycles, hours, or any countable resource.
 */
export function Lifespan({
  label,
  initialCurrent,
  initialTotal,
  unit,
  currentLabel = `${unit.charAt(0).toUpperCase() + unit.slice(1)} used`,
  totalLabel = `Rated life (total)`,
  progressColor = "bg-chart-3",
  className,
  formatValue = (v) => v.toLocaleString(),
}: LifespanProps) {
  const [current, setCurrent] = useState(initialCurrent);
  const [total, setTotal] = useState(initialTotal);
  const [open, setOpen] = useState(false);
  const [editCurrent, setEditCurrent] = useState(String(initialCurrent));
  const [editTotal, setEditTotal] = useState(String(initialTotal));

  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  const remaining = total - current;

  const handleSave = () => {
    const newCurrent = parseInt(editCurrent, 10) || 0;
    const newTotal = parseInt(editTotal, 10) || 0;
    setCurrent(newCurrent);
    setTotal(newTotal);
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setEditCurrent(String(current));
      setEditTotal(String(total));
    }
    setOpen(isOpen);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "group relative flex cursor-pointer flex-col justify-center rounded-xl p-5 ring-1 ring-foreground/10 transition-colors hover:bg-muted/50",
            className
          )}
        >
          <button
            type="button"
            className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
            aria-label={`Edit ${label}`}
          >
            <Pencil className="size-3.5" />
          </button>
          <p className="text-sm font-medium">{label}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">
            {formatValue(current)}{" "}
            <span className="text-base font-normal text-muted-foreground">
              / {formatValue(total)} {unit}
            </span>
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full", progressColor)}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {formatValue(remaining)} {unit} remaining · {pct}% of rated life used
          </p>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Edit {label.toLowerCase()}</h4>
            <p className="text-xs text-muted-foreground">
              Update the usage and rated life values.
            </p>
          </div>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="lifespan-current" className="text-xs">
                {currentLabel}
              </Label>
              <Input
                id="lifespan-current"
                type="number"
                value={editCurrent}
                onChange={(e) => setEditCurrent(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lifespan-total" className="text-xs">
                {totalLabel}
              </Label>
              <Input
                id="lifespan-total"
                type="number"
                value={editTotal}
                onChange={(e) => setEditTotal(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
