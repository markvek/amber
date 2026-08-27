"use client";

import { useState, type ReactNode } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface EditableMetricProps {
  /** Label shown above the metric value */
  label: string;
  /** Initial numeric value */
  initialValue: number;
  /** Unit suffix shown after the value (e.g., "%" or "units") */
  unit?: string;
  /** Secondary text shown below the value */
  subtitle?: string;
  /** Optional progress bar (0-100) */
  progress?: number;
  /** Color class for the progress bar */
  progressColor?: string;
  /** Additional class names */
  className?: string;
  /** Format function for displaying the value */
  formatValue?: (value: number) => string;
  /** Optional chart content rendered below the value */
  chart?: ReactNode;
  /** Sheet title */
  editTitle?: string;
  /** Sheet description */
  editDescription?: string;
}

export function EditableMetric({
  label,
  initialValue,
  unit = "",
  subtitle,
  progress,
  progressColor = "bg-chart-3",
  className,
  formatValue = (v) => v.toLocaleString(),
  chart,
  editTitle,
  editDescription,
}: EditableMetricProps) {
  const [value, setValue] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const [editValue, setEditValue] = useState(String(initialValue));

  const handleSave = () => {
    const parsed = parseFloat(editValue);
    if (!isNaN(parsed)) {
      setValue(parsed);
    }
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setEditValue(String(value));
    }
    setOpen(isOpen);
  };

  return (
    <div className={cn("group relative rounded-xl p-5 ring-1 ring-foreground/10", className)}>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button
            size="icon-sm"
            variant="ghost"
            className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100"
            aria-label={`Edit ${label}`}
          >
            <Pencil className="size-3.5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>{editTitle ?? `Edit ${label}`}</SheetTitle>
            {editDescription && <SheetDescription>{editDescription}</SheetDescription>}
          </SheetHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metric-value">{label}</Label>
              <Input
                id="metric-value"
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                }}
              />
              {unit && (
                <p className="text-xs text-muted-foreground">
                  Value will be displayed with &quot;{unit}&quot; suffix
                </p>
              )}
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
        </SheetContent>
      </Sheet>

      <p className="text-sm font-medium">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight">
        {formatValue(value)}
        {unit && (
          <span className="text-sm font-normal text-muted-foreground"> {unit}</span>
        )}
      </p>

      {progress !== undefined && (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full", progressColor)}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}

      {chart}

      {subtitle && <p className="mt-2 text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

interface EditableProductionChartProps {
  /** Label shown above the chart */
  label: string;
  /** Initial total value */
  initialTotal: number;
  /** Unit description */
  unitLabel?: string;
  /** Chart data - array of { day, value, color } */
  initialData: Array<{ day: string; value: number; color: string }>;
  /** Additional class names */
  className?: string;
}

export function EditableProductionChart({
  label,
  initialTotal,
  unitLabel = "units this month",
  initialData,
  className,
}: EditableProductionChartProps) {
  const [total, setTotal] = useState(initialTotal);
  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [editTotal, setEditTotal] = useState(String(initialTotal));

  const maxValue = Math.max(...data.map((d) => d.value));

  const handleSave = () => {
    const parsed = parseInt(editTotal, 10);
    if (!isNaN(parsed)) {
      setTotal(parsed);
    }
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setEditTotal(String(total));
    }
    setOpen(isOpen);
  };

  return (
    <div className={cn("group relative rounded-xl p-5 ring-1 ring-foreground/10", className)}>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button
            size="icon-sm"
            variant="ghost"
            className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100"
            aria-label={`Edit ${label}`}
          >
            <Pencil className="size-3.5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Edit {label}</SheetTitle>
            <SheetDescription>Update production totals</SheetDescription>
          </SheetHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="total-value">Total {unitLabel}</Label>
              <Input
                id="total-value"
                type="number"
                value={editTotal}
                onChange={(e) => setEditTotal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Daily breakdown</Label>
              <div className="space-y-2">
                {data.map((item, index) => (
                  <div key={item.day} className="flex items-center gap-2">
                    <span className="w-10 text-xs text-muted-foreground">{item.day}</span>
                    <Input
                      type="number"
                      value={item.value}
                      onChange={(e) => {
                        const newData = [...data];
                        newData[index] = { ...item, value: parseInt(e.target.value, 10) || 0 };
                        setData(newData);
                      }}
                      className="h-8"
                    />
                  </div>
                ))}
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
        </SheetContent>
      </Sheet>

      <p className="text-sm font-medium">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight">
        {total.toLocaleString()}{" "}
        <span className="text-sm font-normal text-muted-foreground">{unitLabel}</span>
      </p>
      <div className="mt-3 flex h-16 items-end gap-1.5">
        {data.map(({ day, value, color }) => (
          <div key={day} className="flex h-full flex-1 flex-col justify-end gap-1">
            <div
              className={cn("rounded-t-sm", color)}
              style={{ height: `${(value / maxValue) * 100}%` }}
            />
            <span className="text-center text-[10px] text-muted-foreground">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
