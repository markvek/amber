"use client";

import { useState } from "react";
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

// Sessions by Day Bar Chart
interface SessionsChartProps {
  initialData?: Array<{ day: string; value: number; color: string }>;
  className?: string;
}

export function EditableSessionsChart({
  initialData = [
    { day: "Mon", value: 45, color: "bg-chart-5" },
    { day: "Tue", value: 70, color: "bg-chart-4" },
    { day: "Wed", value: 55, color: "bg-chart-3" },
    { day: "Thu", value: 85, color: "bg-chart-2" },
    { day: "Fri", value: 100, color: "bg-chart-1" },
  ],
  className,
}: SessionsChartProps) {
  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(initialData.map((d) => d.value));

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  const handleSave = () => {
    setData(data.map((d, i) => ({ ...d, value: editData[i] || 0 })));
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setEditData(data.map((d) => d.value));
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
            aria-label="Edit sessions chart"
          >
            <Pencil className="size-3.5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Edit sessions by day</SheetTitle>
            <SheetDescription>Update the daily session values (0-100)</SheetDescription>
          </SheetHeader>
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={item.day} className="flex items-center gap-3">
                <Label className="w-10 shrink-0">{item.day}</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={editData[index]}
                  onChange={(e) => {
                    const newData = [...editData];
                    newData[index] = parseInt(e.target.value, 10) || 0;
                    setEditData(newData);
                  }}
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-2">
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

      <p className="text-sm font-medium">Sessions by day</p>
      <div className="mt-4 flex h-32 items-end gap-2">
        {data.map(({ day, value, color }) => (
          <div key={day} className="flex h-full flex-1 flex-col justify-end gap-1.5">
            <div
              className={cn("rounded-t-md", color)}
              style={{ height: `${(value / maxValue) * 100}%` }}
            />
            <span className="text-center text-xs text-muted-foreground">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Trend Chart
interface TrendChartProps {
  initialValue?: number;
  initialPoints?: number[];
  className?: string;
}

export function EditableTrendChart({
  initialValue = 24,
  initialPoints = [52, 44, 48, 28, 32, 10],
  className,
}: TrendChartProps) {
  const [value, setValue] = useState(initialValue);
  const [points, setPoints] = useState(initialPoints);
  const [open, setOpen] = useState(false);
  const [editValue, setEditValue] = useState(String(initialValue));
  const [editPoints, setEditPoints] = useState(initialPoints);

  // Generate SVG points string from data
  const generatePoints = (pts: number[]) => {
    const xStep = 200 / (pts.length - 1);
    return pts.map((y, i) => `${i * xStep},${y}`).join(" ");
  };

  const generatePolygon = (pts: number[]) => {
    const linePoints = generatePoints(pts);
    return `${linePoints} 200,64 0,64`;
  };

  const handleSave = () => {
    setValue(parseInt(editValue, 10) || 0);
    setPoints(editPoints);
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setEditValue(String(value));
      setEditPoints([...points]);
    }
    setOpen(isOpen);
  };

  return (
    <div className={cn("group relative flex flex-col rounded-xl p-5 ring-1 ring-foreground/10", className)}>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button
            size="icon-sm"
            variant="ghost"
            className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="Edit trend chart"
          >
            <Pencil className="size-3.5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Edit trend</SheetTitle>
            <SheetDescription>Update the trend percentage and chart points</SheetDescription>
          </SheetHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Trend percentage</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">+</span>
                <Input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                <span className="text-muted-foreground">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Chart points (Y values, 0-64, lower = higher on chart)</Label>
              <div className="grid grid-cols-3 gap-2">
                {editPoints.map((pt, index) => (
                  <Input
                    key={index}
                    type="number"
                    min={0}
                    max={64}
                    value={pt}
                    onChange={(e) => {
                      const newPoints = [...editPoints];
                      newPoints[index] = parseInt(e.target.value, 10) || 0;
                      setEditPoints(newPoints);
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
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

      <p className="text-sm font-medium">Trend</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">
        +{value}% <span className="text-sm font-normal text-muted-foreground">this week</span>
      </p>
      <svg
        viewBox="0 0 200 64"
        className="mt-auto h-16 w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label="Upward trend line"
      >
        <polygon points={generatePolygon(points)} className="fill-chart-1/40" />
        <polyline
          points={generatePoints(points)}
          fill="none"
          strokeWidth="2"
          className="stroke-chart-3"
        />
      </svg>
    </div>
  );
}

// Time Allocation Pie Chart
interface TimeAllocationProps {
  initialData?: Array<{ label: string; value: number; color: string; strokeColor: string }>;
  className?: string;
}

export function EditableTimeAllocation({
  initialData = [
    { label: "Design", value: 45, color: "bg-chart-1", strokeColor: "stroke-chart-1" },
    { label: "Build", value: 35, color: "bg-chart-3", strokeColor: "stroke-chart-3" },
    { label: "Review", value: 20, color: "bg-chart-5", strokeColor: "stroke-chart-5" },
  ],
  className,
}: TimeAllocationProps) {
  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(initialData.map((d) => ({ label: d.label, value: d.value })));

  // Calculate offsets for pie chart segments
  const calculateOffsets = (values: number[]) => {
    const offsets: number[] = [0];
    let cumulative = 0;
    for (let i = 0; i < values.length - 1; i++) {
      cumulative -= values[i];
      offsets.push(cumulative);
    }
    return offsets;
  };

  const offsets = calculateOffsets(data.map((d) => d.value));

  const handleSave = () => {
    setData(data.map((d, i) => ({ ...d, label: editData[i].label, value: editData[i].value })));
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setEditData(data.map((d) => ({ label: d.label, value: d.value })));
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
            aria-label="Edit time allocation"
          >
            <Pencil className="size-3.5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Edit time allocation</SheetTitle>
            <SheetDescription>Update labels and percentages (should sum to 100)</SheetDescription>
          </SheetHeader>
          <div className="space-y-4">
            {editData.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className={cn("size-3 shrink-0 rounded-full", data[index].color)} />
                <Input
                  value={item.label}
                  onChange={(e) => {
                    const newData = [...editData];
                    newData[index] = { ...item, label: e.target.value };
                    setEditData(newData);
                  }}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={item.value}
                  onChange={(e) => {
                    const newData = [...editData];
                    newData[index] = { ...item, value: parseInt(e.target.value, 10) || 0 };
                    setEditData(newData);
                  }}
                  className="w-20"
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Total: {editData.reduce((sum, d) => sum + d.value, 0)}%
            </p>
            <div className="flex justify-end gap-2 pt-2">
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

      <p className="text-sm font-medium">Time allocation</p>
      <div className="mt-4 flex items-center gap-6">
        <svg viewBox="0 0 42 42" className="size-28 shrink-0 -rotate-90" role="img" aria-label="Pie chart">
          {data.map((item, index) => (
            <circle
              key={item.label}
              cx="21"
              cy="21"
              r="15.915"
              fill="none"
              strokeWidth="8"
              strokeDasharray={`${item.value} ${100 - item.value}`}
              strokeDashoffset={offsets[index]}
              className={item.strokeColor}
            />
          ))}
        </svg>
        <ul className="space-y-2 text-sm">
          {data.map((item) => (
            <li key={item.label} className="flex items-center gap-2">
              <span className={cn("size-2 rounded-full", item.color)} />
              <span>{item.label}</span>
              <span className="text-muted-foreground">{item.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
