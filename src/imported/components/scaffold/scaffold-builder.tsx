"use client";

import { useState } from "react";
import {
  BarChart3,
  Clock,
  FileText,
  FolderOpen,
  ImageIcon,
  MessageSquare,
  MousePointer2,
  Plus,
  SquareStack,
  Type,
  UploadCloud,
  Wrench,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AssociatedFiles } from "@/components/workspace/associated-files";
import {
  EditableSessionsChart,
  EditableTrendChart,
  EditableTimeAllocation,
} from "@/components/workspace/editable-charts";
import { EditableHistoryTimeline } from "@/components/workspace/history-timeline";
import { Lifespan } from "@/components/workspace/lifespan";
import { MaintenanceLog } from "@/components/workspace/maintenance-log";
import { MaintenanceBoard } from "@/components/workspace/maintenance-board";
import { Chat } from "@/components/chat/chat-parts";

type BoxContent =
  | "empty"
  | "card"
  | "text"
  | "image"
  | "upload"
  | "sessionsChart"
  | "trendChart"
  | "timeAllocation"
  | "lifespan"
  | "maintenanceLog"
  | "maintenanceBoard"
  | "historyTimeline"
  | "associatedFiles"
  | "chat"
  | "button"
  | "badge";
type BoxWidth = 1 | 2 | 3 | 4;
export type ScaffoldBox = { id: string; width: BoxWidth; content: BoxContent };
type Box = ScaffoldBox;

// Grid is 2 columns on small screens, 4 from md up — narrow boxes widen gracefully on mobile.
const widthClasses: Record<BoxWidth, string> = {
  1: "col-span-1",
  2: "col-span-1 md:col-span-2",
  3: "col-span-2 md:col-span-3",
  4: "col-span-2 md:col-span-4",
};

type ContentOption = {
  value: Exclude<BoxContent, "empty">;
  label: string;
  icon: typeof Type;
};

type ContentCategory = {
  label: string;
  options: ContentOption[];
};

const contentCategories: ContentCategory[] = [
  {
    label: "Basic",
    options: [
      { value: "card", label: "Card", icon: FileText },
      { value: "text", label: "Text block", icon: Type },
      { value: "button", label: "Button", icon: MousePointer2 },
      { value: "badge", label: "Badge", icon: SquareStack },
      { value: "image", label: "Image", icon: ImageIcon },
    ],
  },
  {
    label: "Data Visualization",
    options: [
      { value: "sessionsChart", label: "Sessions chart", icon: BarChart3 },
      { value: "trendChart", label: "Trend chart", icon: BarChart3 },
      { value: "timeAllocation", label: "Time allocation", icon: BarChart3 },
      { value: "lifespan", label: "Lifespan indicator", icon: BarChart3 },
    ],
  },
  {
    label: "Records & Logs",
    options: [
      { value: "maintenanceLog", label: "Maintenance log", icon: Wrench },
      { value: "maintenanceBoard", label: "Maintenance board", icon: Wrench },
      { value: "historyTimeline", label: "History timeline", icon: Clock },
    ],
  },
  {
    label: "Files & Communication",
    options: [
      { value: "upload", label: "File drop", icon: UploadCloud },
      { value: "associatedFiles", label: "Associated files", icon: FolderOpen },
      { value: "chat", label: "Chat", icon: MessageSquare },
    ],
  },
];

function BoxContentView({ content }: { content: Exclude<BoxContent, "empty"> }) {
  switch (content) {
    case "card":
      return (
        <Card size="sm" className="h-full">
          <CardHeader>
            <CardTitle>Card title</CardTitle>
            <CardDescription>A card slotted into the layout.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Body content lives here.</p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Action</Button>
          </CardFooter>
        </Card>
      );
    case "text":
      return (
        <div className="flex h-full flex-col justify-center rounded-xl bg-muted/40 p-5">
          <h3 className="text-lg font-semibold tracking-tight">Text block</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            A run of copy placed in the scaffold — headings, paragraphs, or anything
            written.
          </p>
        </div>
      );
    case "button":
      return (
        <div className="flex h-full min-h-32 flex-col items-center justify-center gap-3 rounded-xl bg-muted/40 p-5">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button size="sm">Primary</Button>
            <Button size="sm" variant="secondary">Secondary</Button>
            <Button size="sm" variant="destructive">Destructive</Button>
          </div>
          <p className="text-xs text-muted-foreground">Button group</p>
        </div>
      );
    case "badge":
      return (
        <div className="flex h-full min-h-32 flex-col items-center justify-center gap-3 rounded-xl bg-muted/40 p-5">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Alert</Badge>
          </div>
          <p className="text-xs text-muted-foreground">Status badges</p>
        </div>
      );
    case "image":
      return (
        <div className="flex h-full min-h-32 items-center justify-center rounded-xl bg-secondary text-secondary-foreground/50">
          <ImageIcon className="size-8" />
        </div>
      );
    case "upload":
      return (
        <div className="flex h-full min-h-32 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-6 text-center">
          <UploadCloud className="size-6 text-muted-foreground" />
          <p className="text-sm font-medium">Drop a file here</p>
          <p className="text-xs text-muted-foreground">or browse — up to 10 MB</p>
        </div>
      );
    case "sessionsChart":
      return <EditableSessionsChart />;
    case "trendChart":
      return <EditableTrendChart />;
    case "timeAllocation":
      return <EditableTimeAllocation />;
    case "lifespan":
      return (
        <Lifespan
          label="Stamp lifespan"
          initialCurrent={20000}
          initialTotal={50000}
          unit="stamps"
          currentLabel="Stamps used"
        />
      );
    case "maintenanceLog":
      return (
        <MaintenanceLog
          initialEntries={[
            { id: "1", type: "cleaned", label: "Cleaned", date: "Jul 18, 2026", by: "Dana Kim" },
            { id: "2", type: "oiled", label: "Oiled", date: "Jul 18, 2026", by: "Dana Kim" },
            { id: "3", type: "inspected", label: "Inspected", date: "Jun 30, 2026", by: "Jorge Alvarez" },
          ]}
        />
      );
    case "maintenanceBoard":
      return (
        <MaintenanceBoard
          columns={[
            { label: "Past maintenance", placeholderCount: 2 },
            { label: "Daily checks", placeholderCount: 2 },
            { label: "Quarterly checks", placeholderCount: 2 },
          ]}
        />
      );
    case "historyTimeline":
      return (
        <EditableHistoryTimeline
          title="Recent events"
          initialEvents={[
            {
              date: "Jul 2026 · Machine 12",
              title: "Current production run",
              description: "Sample order #2041",
              meta: "6,000 stamps",
            },
            {
              date: "May 2026 · Machine 12",
              title: "Production run",
              meta: "8,000 stamps",
            },
          ]}
        />
      );
    case "associatedFiles":
      return (
        <AssociatedFiles
          initialFiles={[
            { name: "project-spec.pdf", meta: "2.4 MB · PDF" },
            { name: "design-drawings.zip", meta: "12.4 MB · Archive" },
          ]}
        />
      );
    case "chat":
      return (
        <div className="flex h-full min-h-64 flex-col overflow-hidden rounded-xl ring-1 ring-foreground/10">
          <div className="flex items-center gap-2.5 border-b bg-card px-4 py-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <MessageSquare className="size-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm leading-none font-semibold">Assistant</p>
              <p className="mt-1 text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <Chat className="flex-1" />
        </div>
      );
  }
}

export function ScaffoldBuilder({
  initialBoxes,
  pageId,
}: {
  initialBoxes?: ScaffoldBox[];
  pageId?: string;
}) {
  const [boxes, setBoxes] = useState<Box[]>(
    initialBoxes ?? [
      { id: "seed-full", width: 4, content: "empty" },
      { id: "seed-half", width: 2, content: "empty" },
    ]
  );

  // Persist boxes to localStorage when pageId is provided
  const updateBoxes = (updater: (prev: Box[]) => Box[]) => {
    setBoxes((prev) => {
      const next = updater(prev);
      if (pageId) {
        try {
          window.localStorage.setItem(`page-boxes.${pageId}`, JSON.stringify(next));
        } catch {
          // Storage full or unavailable
        }
      }
      return next;
    });
  };

  const addBox = (width: Box["width"]) =>
    updateBoxes((prev) => [...prev, { id: crypto.randomUUID().slice(0, 8), width, content: "empty" }]);

  const fillBox = (id: string, content: BoxContent) =>
    updateBoxes((prev) => prev.map((b) => (b.id === id ? { ...b, content } : b)));

  const removeBox = (id: string) => updateBoxes((prev) => prev.filter((b) => b.id !== id));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {boxes.map((box) => (
          <div
            key={box.id}
            className={cn("group/box relative", widthClasses[box.width])}
          >
            <Button
              size="icon-xs"
              variant="secondary"
              aria-label="Remove box"
              onClick={() => removeBox(box.id)}
              className="absolute -top-2 -right-2 z-10 rounded-full opacity-0 shadow-sm transition-opacity group-hover/box:opacity-100 focus-visible:opacity-100"
            >
              <X />
            </Button>
            {box.content === "empty" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Choose content for this box"
                    className="flex h-36 w-full items-center justify-center rounded-xl border-2 border-dotted border-border text-muted-foreground transition-colors outline-none hover:border-border-accent hover:text-accent focus-visible:border-border-accent focus-visible:text-accent"
                  >
                    <span className="flex size-8 items-center justify-center rounded-full border border-current">
                      <Plus className="size-4" />
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="max-h-80 overflow-y-auto">
                  {contentCategories.map((category, catIndex) => (
                    <div key={category.label}>
                      {catIndex > 0 && <DropdownMenuSeparator />}
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        {category.label}
                      </DropdownMenuLabel>
                      {category.options.map(({ value, label, icon: Icon }) => (
                        <DropdownMenuItem key={value} onSelect={() => fillBox(box.id, value)}>
                          <Icon className="size-4" /> {label}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <BoxContentView content={box.content} />
            )}
          </div>
        ))}
      </div>

      <div className="group/add relative flex h-16 items-center justify-center rounded-xl border-2 border-dotted border-transparent transition-colors group-focus-within/add:border-border hover:border-border">
        <span className="pointer-events-none absolute text-xs text-muted-foreground/50 transition-opacity group-hover/add:opacity-0 group-focus-within/add:opacity-0">
          Hover here to add a box
        </span>
        <div className="flex items-center gap-2 opacity-0 transition-opacity group-focus-within/add:opacity-100 group-hover/add:opacity-100">
          <span className="text-xs text-muted-foreground">Add box:</span>
          {([1, 2, 3, 4] as const).map((w) => (
            <Button key={w} variant="secondary" size="xs" onClick={() => addBox(w)}>
              {w} wide
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
