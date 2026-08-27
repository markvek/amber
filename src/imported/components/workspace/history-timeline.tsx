"use client";

import { useState } from "react";
import { Pencil, Plus, X } from "lucide-react";

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

export type HistoryEvent = {
  date: string;
  title: string;
  description?: string;
  meta?: string;
};

/**
 * A vertical history timeline: a connected trunk line with a node per event,
 * plus an optional meta pill (e.g. a stamp count) on the right. Reusable for any
 * chronological record — mold usage, maintenance, order history, etc.
 */
export function HistoryTimeline({ events: initialEvents }: { events: HistoryEvent[] }) {
  return (
    <ol className="relative">
      {initialEvents.map((event, i) => {
        const isLast = i === initialEvents.length - 1;
        return (
          <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && (
              <span
                aria-hidden
                className="absolute top-4 left-[7px] h-full w-px bg-border"
              />
            )}
            <span className="relative z-10 mt-1 flex size-3.5 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-background">
              <span className="size-1.5 rounded-full bg-accent" />
            </span>
            <div className={cn("-mt-0.5 min-w-0 flex-1")}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-medium">{event.title}</p>
                {event.meta && (
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {event.meta}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{event.date}</p>
              {event.description && (
                <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Editable history timeline with a sheet panel for editing all events.
 */
export function EditableHistoryTimeline({
  initialEvents,
  title = "Recent events",
  className,
}: {
  initialEvents: HistoryEvent[];
  title?: string;
  className?: string;
}) {
  const [events, setEvents] = useState<HistoryEvent[]>(initialEvents);
  const [open, setOpen] = useState(false);
  const [editEvents, setEditEvents] = useState<HistoryEvent[]>(initialEvents);

  const handleSave = () => {
    setEvents(editEvents.filter((e) => e.title.trim() && e.date.trim()));
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setEditEvents([...events]);
    }
    setOpen(isOpen);
  };

  const updateEvent = (index: number, field: keyof HistoryEvent, value: string) => {
    const newEvents = [...editEvents];
    newEvents[index] = { ...newEvents[index], [field]: value };
    setEditEvents(newEvents);
  };

  const addEvent = () => {
    setEditEvents([...editEvents, { title: "", date: "", description: "", meta: "" }]);
  };

  const removeEvent = (index: number) => {
    setEditEvents(editEvents.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("group relative rounded-xl p-5 ring-1 ring-foreground/10", className)}>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button
            size="icon-sm"
            variant="ghost"
            className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="Edit timeline"
          >
            <Pencil className="size-3.5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit timeline events</SheetTitle>
            <SheetDescription>Update event details or add new entries</SheetDescription>
          </SheetHeader>
          <div className="flex-1 space-y-4 overflow-y-auto">
            {editEvents.map((event, index) => (
              <div key={index} className="rounded-lg border bg-muted/30 p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Event {index + 1}</span>
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    onClick={() => removeEvent(index)}
                    aria-label="Remove event"
                  >
                    <X className="size-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">Title</Label>
                    <Input
                      value={event.title}
                      onChange={(e) => updateEvent(index, "title", e.target.value)}
                      placeholder="Event title"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Date</Label>
                      <Input
                        value={event.date}
                        onChange={(e) => updateEvent(index, "date", e.target.value)}
                        placeholder="Jul 2026 · Machine 12"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Count/Meta</Label>
                      <Input
                        value={event.meta || ""}
                        onChange={(e) => updateEvent(index, "meta", e.target.value)}
                        placeholder="6,000 stamps"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Description</Label>
                    <Input
                      value={event.description || ""}
                      onChange={(e) => updateEvent(index, "description", e.target.value)}
                      placeholder="Optional description"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addEvent} className="w-full">
              <Plus className="mr-1.5 size-3.5" />
              Add event
            </Button>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <p className="mb-4 text-sm font-medium">{title}</p>
      {events.length > 0 ? (
        <HistoryTimeline events={events} />
      ) : (
        <p className="text-sm text-muted-foreground">No events yet. Click the edit button to add events.</p>
      )}
    </div>
  );
}

/**
 * Interactive wrapper for HistoryTimeline with add functionality.
 * Shows a header with title, description, and a plus button to add new entries.
 */
export function UsageHistoryCard({
  title = "Usage history",
  description = "Every run this mold has been through, most recent first.",
  initialEvents,
  className,
}: {
  title?: string;
  description?: string;
  initialEvents: HistoryEvent[];
  className?: string;
}) {
  const [events, setEvents] = useState<HistoryEvent[]>(initialEvents);
  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: "",
    date: "",
    description: "",
    meta: "",
  });

  const handleAdd = () => {
    if (!newEntry.title.trim() || !newEntry.date.trim()) return;

    const entry: HistoryEvent = {
      title: newEntry.title.trim(),
      date: newEntry.date.trim(),
      description: newEntry.description.trim() || undefined,
      meta: newEntry.meta.trim() || undefined,
    };

    setEvents((prev) => [entry, ...prev]);
    setNewEntry({ title: "", date: "", description: "", meta: "" });
    setIsAdding(false);
  };

  const handleCancel = () => {
    setNewEntry({ title: "", date: "", description: "", meta: "" });
    setIsAdding(false);
  };

  return (
    <div className={cn("rounded-xl p-5 ring-1 ring-foreground/10", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={() => setIsAdding(true)}
          aria-label="Add new log entry"
          className="shrink-0"
        >
          <Plus className="size-4" />
        </Button>
      </div>

      {isAdding && (
        <div className="mt-4 rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="text-sm font-medium">New log entry</p>
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={handleCancel}
              aria-label="Cancel"
            >
              <X className="size-3.5" />
            </Button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={newEntry.title}
                onChange={(e) => setNewEntry((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Production run"
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring/50"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Date <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry((prev) => ({ ...prev, date: e.target.value }))}
                  placeholder="e.g., Jul 2026 · Machine 12"
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring/50"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Count</label>
                <input
                  type="text"
                  value={newEntry.meta}
                  onChange={(e) => setNewEntry((prev) => ({ ...prev, meta: e.target.value }))}
                  placeholder="e.g., 5,000 stamps"
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring/50"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Description</label>
              <input
                type="text"
                value={newEntry.description}
                onChange={(e) => setNewEntry((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., Customer name — order details"
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring/50"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button size="sm" variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAdd}
                disabled={!newEntry.title.trim() || !newEntry.date.trim()}
              >
                Add entry
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className={cn(isAdding ? "mt-4" : "mt-4")}>
        <HistoryTimeline events={events} />
      </div>
    </div>
  );
}
