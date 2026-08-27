"use client";

import { useState } from "react";
import {
  Droplet,
  History,
  Pencil,
  Plus,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type MaintenanceType = "cleaned" | "oiled" | "inspected" | "repaired";

type MaintenanceEntry = {
  id: string;
  type: MaintenanceType;
  label: string;
  date: string;
  by: string;
};

const typeConfig: Record<MaintenanceType, { icon: LucideIcon; label: string }> = {
  cleaned: { icon: Sparkles, label: "Cleaned" },
  oiled: { icon: Droplet, label: "Oiled" },
  inspected: { icon: Wrench, label: "Inspected" },
  repaired: { icon: Wrench, label: "Repaired" },
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function MaintenanceLog({
  initialEntries,
}: {
  initialEntries: MaintenanceEntry[];
}) {
  const [entries, setEntries] = useState<MaintenanceEntry[]>(initialEntries);
  const [open, setOpen] = useState(false);
  const [newType, setNewType] = useState<MaintenanceType>("cleaned");
  const [newBy, setNewBy] = useState("");

  const recentEntries = entries.slice(0, 3);

  const handleAddEntry = () => {
    if (!newBy.trim()) return;

    const entry: MaintenanceEntry = {
      id: crypto.randomUUID().slice(0, 8),
      type: newType,
      label: typeConfig[newType].label,
      date: formatDate(new Date()),
      by: newBy.trim(),
    };

    setEntries([entry, ...entries]);
    setNewBy("");
    setNewType("cleaned");
    // Close the sheet after adding entry
    setOpen(false);
  };

  return (
    <div className="col-span-2 rounded-xl p-5 ring-1 ring-foreground/10">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">Maintenance</p>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="icon-sm" variant="ghost" aria-label="Edit maintenance log">
              <Pencil className="size-3.5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Maintenance Log</SheetTitle>
              <SheetDescription>
                View history and add new maintenance entries
              </SheetDescription>
            </SheetHeader>

            {/* Add new entry form */}
            <div className="space-y-4 border-b pb-6">
              <p className="text-sm font-medium">Add new entry</p>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <RadioGroup
                    value={newType}
                    onValueChange={(v) => setNewType(v as MaintenanceType)}
                    className="grid grid-cols-2 gap-2"
                  >
                    {Object.entries(typeConfig).map(([key, { icon: Icon, label }]) => (
                      <label
                        key={key}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-sm has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5"
                      >
                        <RadioGroupItem value={key} />
                        <Icon className="size-4 text-muted-foreground" />
                        <span>{label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maintenance-by">Performed by</Label>
                  <Input
                    id="maintenance-by"
                    placeholder="Enter name"
                    value={newBy}
                    onChange={(e) => setNewBy(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddEntry();
                    }}
                  />
                </div>
                <Button onClick={handleAddEntry} disabled={!newBy.trim()}>
                  <Plus className="mr-1.5 size-4" />
                  Add Entry
                </Button>
              </div>
            </div>

            {/* History */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="flex items-center gap-2 py-4">
                <History className="size-4 text-muted-foreground" />
                <p className="text-sm font-medium">Full History</p>
                <span className="text-xs text-muted-foreground">
                  ({entries.length} entries)
                </span>
              </div>
              <ul className="space-y-3">
                {entries.map((entry) => {
                  const Icon = typeConfig[entry.type]?.icon ?? Wrench;
                  return (
                    <li
                      key={entry.id}
                      className="flex items-center gap-3 rounded-lg bg-muted/50 p-3"
                    >
                      <Icon className="size-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{entry.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.date} · {entry.by}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Recent entries preview */}
      <ul className="mt-3 space-y-2.5 text-sm">
        {recentEntries.map((entry) => {
          const Icon = typeConfig[entry.type]?.icon ?? Wrench;
          return (
            <li key={entry.id} className="flex items-center gap-3">
              <Icon className="size-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 font-medium">{entry.label}</span>
              <span className="text-xs text-muted-foreground">
                {entry.date} · {entry.by}
              </span>
            </li>
          );
        })}
      </ul>

      {entries.length > 3 && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 text-xs text-muted-foreground hover:text-foreground"
        >
          + {entries.length - 3} more entries
        </button>
      )}
    </div>
  );
}
