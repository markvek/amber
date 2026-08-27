'use client';

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Copy,
  Download,
  Droplet,
  FileText,
  Grip,
  Heart,
  HelpCircle,
  ImageIcon,
  Layers,
  LayoutGrid,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings,
  Sparkles,
  Trash2,
  Upload,
  UploadCloud,
  User,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AssociatedFiles } from "@/components/workspace/associated-files";
import { EditableCard } from "@/components/workspace/editable-card";
import {
  EditableSessionsChart,
  EditableTrendChart,
  EditableTimeAllocation,
} from "@/components/workspace/editable-charts";
import { EditableHistoryTimeline } from "@/components/workspace/history-timeline";
import { CalendarView } from "@/components/workspace/calendar-view";
import { MeetingCard, ROOM_NAMES } from "@/components/workspace/meeting-card";
import { RoomPage } from "@/components/workspace/room-page";
import { rooms } from "@/data/rooms";
import { Lifespan } from "@/components/workspace/lifespan";
import { MaintenanceBoard } from "@/components/workspace/maintenance-board";
import { MaintenanceLog } from "@/components/workspace/maintenance-log";
import { PageEditButton } from "@/components/workspace/page-edit-button";
import { KeyboardNavigablePage } from "@/components/KeyboardNavigablePage";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { CardPlayground } from "./card-playground";
import { ChatExample } from "./chat-example";

function Section({
  title,
  description,
  children,
  editable,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  editable?: boolean;
}) {
  return (
    <section className="group/section relative space-y-6" data-keyboard-nav-section>
      {editable && (
        <Button
          size="icon-sm"
          variant="ghost"
          className="absolute -left-8 top-0 opacity-0 transition-opacity group-hover/section:opacity-100"
          aria-label={`Edit ${title} section`}
        >
          <Pencil className="size-3.5" />
        </Button>
      )}
      <div className="space-y-1">
        <h2 className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
          {title}
        </h2>
        {description && <p className="text-sm text-muted-foreground/70">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function Specimen({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[8rem_1fr] items-baseline gap-4">
      <span className="text-xs text-muted-foreground/60 tabular-nums">{label}</span>
      <div>{children}</div>
    </div>
  );
}

const colorTokens = [
  { name: "background", className: "bg-background" },
  { name: "foreground", className: "bg-foreground" },
  { name: "primary", className: "bg-primary" },
  { name: "secondary", className: "bg-secondary" },
  { name: "muted", className: "bg-muted" },
  { name: "accent", className: "bg-accent" },
  { name: "destructive", className: "bg-destructive" },
  { name: "border", className: "bg-border" },
  { name: "border-accent", className: "bg-border-accent" },
  { name: "border-destructive", className: "bg-border-destructive" },
];

export function GlobalsPageContent() {
  const headerRef = useRef<HTMLElement>(null);

  // Scroll to the header section when the page opens
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      headerRef.current?.scrollIntoView({ behavior: "instant", block: "start" });
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <KeyboardNavigablePage>
      <div className="mx-auto w-full max-w-4xl flex-1 space-y-12 px-6 py-16">
        <header ref={headerRef} className="space-y-2">
          <p className="text-xs text-muted-foreground">Design System / globals</p>
          <div className="flex items-start gap-4">
            <h1 className="min-w-0 flex-1 text-3xl font-semibold tracking-tight">Globals</h1>
            <PageEditButton />
          </div>
          <p className="text-muted-foreground">
            This is a visual layout of the .css file under{" "}
            <code className="font-mono text-sm">src/app/globals.css</code>.
          </p>
        </header>

        <Separator />

        <Section
          title="Page Scaffolding"
          description="The foundation of every page — define layout size and place components as individual items or preset groups."
        >
          <div className="space-y-6">
            {/* Layout sizes */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Layout sizes
              </h3>
              <p className="text-sm text-muted-foreground/70">
                Pages use a 4-column grid. Components span full-width, half-width, or quarter-width.
              </p>
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-4 flex h-16 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30">
                  <span className="text-xs text-muted-foreground">Full width (4 cols)</span>
                </div>
                <div className="col-span-2 flex h-16 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30">
                  <span className="text-xs text-muted-foreground">Half (2 cols)</span>
                </div>
                <div className="col-span-2 flex h-16 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30">
                  <span className="text-xs text-muted-foreground">Half (2 cols)</span>
                </div>
                <div className="col-span-1 flex h-16 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30">
                  <span className="text-xs text-muted-foreground">1 col</span>
                </div>
                <div className="col-span-1 flex h-16 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30">
                  <span className="text-xs text-muted-foreground">1 col</span>
                </div>
                <div className="col-span-1 flex h-16 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30">
                  <span className="text-xs text-muted-foreground">1 col</span>
                </div>
                <div className="col-span-1 flex h-16 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30">
                  <span className="text-xs text-muted-foreground">1 col</span>
                </div>
              </div>
            </div>

            {/* Component placement */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Component placement
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl p-5 ring-1 ring-foreground/10">
                  <div className="flex items-center gap-2">
                    <Grip className="size-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Individual components</p>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drag single components into any slot — cards, charts, file viewers, forms, or custom blocks.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="outline">Card</Badge>
                    <Badge variant="outline">Chart</Badge>
                    <Badge variant="outline">Table</Badge>
                    <Badge variant="outline">Form</Badge>
                    <Badge variant="outline">Image</Badge>
                  </div>
                </div>
                <div className="rounded-xl p-5 ring-1 ring-foreground/10">
                  <div className="flex items-center gap-2">
                    <Layers className="size-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Preset groups</p>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drop pre-configured layouts — a machine dashboard, customer profile, or maintenance board in one click.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="secondary">Machine</Badge>
                    <Badge variant="secondary">Customer</Badge>
                    <Badge variant="secondary">Mold</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Link to scaffolding page */}
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
              <LayoutGrid className="size-5 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">Try the interactive builder</p>
                <p className="text-xs text-muted-foreground">
                  Build layouts visually in the Page Scaffolding tool.
                </p>
              </div>
              <Link href="/scaffolding">
                <Button size="sm" variant="outline">
                  Open builder
                </Button>
              </Link>
            </div>
          </div>
        </Section>

        <Separator />

        <Section title="Text" description="Header, body, and supporting text treatments.">
          <Specimen label="Header">
            <h1 className="text-3xl font-semibold tracking-tight">Header</h1>
          </Specimen>
          <Specimen label="Sub-header">
            <h2 className="text-lg font-semibold tracking-tight">Sub-header</h2>
          </Specimen>
          <Specimen label="Subtitle">
            <p className="text-sm font-semibold text-muted-foreground">Subtitle</p>
          </Specimen>
          <Specimen label="Body">
            <p className="text-sm text-foreground">
              Body — a regular paragraph of text that runs to multiple lines and can contain{" "}
              <strong>bold</strong> or <em>italic</em> emphasis.
            </p>
          </Specimen>
          <Specimen label="Footnote">
            <p className="text-xs text-muted-foreground">* Footnote — small and dimmed for supporting details</p>
          </Specimen>
        </Section>

        <Separator />

        <Section title="Buttons" description="Interactive button treatments.">
          <div className="space-y-6">
            {/* Variants */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Variants
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Sizes
              </h3>
              <div className="space-y-4">
                <Specimen label="XS">
                  <Button size="xs">Extra small</Button>
                  <p className="mt-1 text-xs text-muted-foreground">Chips and dense tables</p>
                </Specimen>
                <Specimen label="SM">
                  <Button size="sm">Small</Button>
                  <p className="mt-1 text-xs text-muted-foreground">Card footers, toolbars</p>
                </Specimen>
                <Specimen label="MD">
                  <Button size="default">Default</Button>
                  <p className="mt-1 text-xs text-muted-foreground">Most actions, most surfaces</p>
                </Specimen>
                <Specimen label="LG">
                  <Button size="lg">Large</Button>
                  <p className="mt-1 text-xs text-muted-foreground">Hero and empty states</p>
                </Specimen>
              </div>
            </div>

            {/* Icon buttons */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Icon buttons
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button size="icon-sm">
                  <Plus className="size-3.5" />
                </Button>
                <span className="text-xs text-muted-foreground">Icon-only controls</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="icon">
                  <Plus className="size-4" />
                </Button>
              </div>
              <div>
                <p className="mt-4 text-xs text-muted-foreground">With icon</p>
                <Button size="default" className="mt-2 gap-2">
                  <ArrowRight className="size-4" />
                  Continue
                </Button>
              </div>
            </div>

            {/* Disabled state */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Disabled
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button disabled>Default</Button>
                <Button disabled variant="secondary">
                  Secondary
                </Button>
              </div>
            </div>
          </div>
        </Section>

        <Separator />

        <Section title="Cards" description="Layout patterns built from card, section and content components.">
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground/70">
              Toggle each section to view the dynamic card component.
            </p>
            <CardPlayground />
            <div className="space-y-3">
              <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Sizes
              </h3>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Project overview</CardTitle>
                    <CardDescription>Everything a full card can carry.</CardDescription>
                    <CardAction>
                      <Badge>Active</Badge>
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Content area for body copy, lists, or media. The footer below is a distinct slot with its own background.
                    </p>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button variant="secondary">Dismiss</Button>
                    <Button>View</Button>
                  </CardFooter>
                </Card>

                <Card size="sm">
                  <CardHeader>
                    <CardTitle>Compact card</CardTitle>
                    <CardDescription>The small size tightens spacing throughout.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Useful for dense grids and side panels.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Section>

        <Separator />

        <Section title="Editable cards" description="Cards that reveal an edit button on hover." editable>
          <div className="space-y-4">
            <EditableCard
              editTitle="Edit metric"
              editContent={<Input placeholder="Enter value..." />}
            >
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">units</p>
                <p className="text-2xl font-semibold">24,560</p>
                <p className="text-xs text-muted-foreground">Hover to reveal the edit button</p>
              </div>
            </EditableCard>

            <Card className="max-w-sm bg-muted/50 p-4">
              <p className="text-sm font-medium">Pattern usage</p>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                <li>Wrap any card content with EditableCard</li>
                <li>Provide editTitle and editContent props</li>
                <li>Edit button appears on hover</li>
                <li>Sheet slides in from the right</li>
              </ul>
            </Card>
          </div>
        </Section>

        <Separator />

        <Section title="Card free" description="An image entry pasted directly into the page — image plus footnote, no card chrome.">
          <figure className="space-y-2">
            <div className="flex aspect-video items-center justify-center rounded-xl bg-secondary text-secondary-foreground/50">
              <ImageIcon className="size-12" />
            </div>
            <figcaption className="text-xs text-muted-foreground">* A footnote caption travels with the image.</figcaption>
          </figure>
        </Section>

        <Separator />

        <Section
          title="Maintenance board"
          description="A three-column checklist card — reused on the machine and mold pages."
          editable
        >
          <MaintenanceBoard
            columns={[
              {
                label: "Maintenance",
                items: [
                  { icon: <Wrench className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />, text: "Hydraulic oil replaced" },
                  { icon: <Wrench className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />, text: "Nozzle heater band swapped" },
                  { icon: <Wrench className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />, text: "Full quarterly service" },
                ],
              },
              {
                label: "Past maintenance",
                items: [
                  { icon: <Wrench className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />, text: "Hydraulic oil replaced" },
                  { icon: <Wrench className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />, text: "Nozzle heater band swapped" },
                  { icon: <Wrench className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />, text: "Full quarterly service" },
                ],
              },
              {
                label: "Quarterly checks",
                items: [
                  { icon: <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />, text: "Replace hydraulic filters" },
                  { icon: <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />, text: "Calibrate temperature controllers" },
                  { icon: <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />, text: "Inspect tie-bar wear" },
                  { icon: <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />, text: "Grease toggle linkage" },
                ],
              },
            ]}
          />
        </Section>

        <Separator />

        <Section title="Badges" description="Status and label treatments.">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge className="bg-accent">Active</Badge>
            <Badge className="border-accent text-accent">Accent outline</Badge>
            <Badge variant="destructive">Error</Badge>
            <Badge className="border-2 bg-transparent">Bordered</Badge>
          </div>
        </Section>

        <Separator />

        <Section title="Icons" description="Sized with Tailwind utilities, colored by the same tokens as text.">
          <div className="flex flex-wrap gap-4">
            <Search className="size-4 text-muted-foreground" />
            <Settings className="size-5 text-muted-foreground" />
            <Heart className="size-6 text-muted-foreground" />
            <Sparkles className="size-8 text-muted-foreground" />
          </div>
        </Section>

        <Separator />

        <Section title="Inputs" description="Text fields with labels, placeholder, and disabled state.">
          <div className="space-y-6">
            <Specimen label="Email">
              <Input type="email" placeholder="you@example.com" />
            </Specimen>
            <Specimen label="Number">
              <Input type="number" placeholder="0" />
            </Specimen>
            <Specimen label="Long text">
              <Textarea placeholder="Write something longer…" />
            </Specimen>
            <Specimen label="Single characters">
              <div className="flex gap-2">
                <Input maxLength={1} placeholder="1" />
                <Input maxLength={1} placeholder="2" />
                <Input maxLength={1} placeholder="3" />
                <Input maxLength={1} placeholder="4" />
              </div>
            </Specimen>
            <Specimen label="Error state">
              <div className="space-y-1">
                <Input placeholder="Error state" />
                <p className="text-xs text-destructive">Please enter a valid email address</p>
              </div>
            </Specimen>
            <Specimen label="Success state">
              <div className="space-y-1">
                <Input placeholder="Success state" />
                <p className="text-xs text-accent">Email verified successfully</p>
              </div>
            </Specimen>
            <Specimen label="Disabled">
              <Input placeholder="Not editable" disabled />
            </Specimen>
          </div>
        </Section>

        <Separator />

        <Section title="States & feedback" description="Visual indicators for success, warning, error, and interactive states using focus and action tokens.">
          <div className="space-y-6">
            {/* Alert cards */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Alert cards
              </h3>
              <div className="space-y-2">
                <Card className="border-accent/30 bg-accent/5">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium text-accent">Success</p>
                    <p className="mt-1 text-sm text-muted-foreground">Your changes have been saved.</p>
                  </CardContent>
                </Card>

                <Card className="border-destructive/30 bg-destructive/5">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium text-destructive">Error</p>
                    <p className="mt-1 text-sm text-muted-foreground">Something went wrong. Please try again.</p>
                  </CardContent>
                </Card>

                <Card className="border-border bg-muted/20">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium">Information</p>
                    <p className="mt-1 text-sm text-muted-foreground">This action will update all related records.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Interactive elements */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Interactive elements
              </h3>
              <div className="space-y-2">
                <Specimen label="Links">
                  <div className="flex flex-col gap-2">
                    <a href="#" className="text-sm text-accent underline underline-offset-2 hover:text-border-accent">
                      Accent link style — used for navigation
                    </a>
                    <a href="#" className="text-sm text-destructive underline underline-offset-2 hover:text-border-destructive">
                      Destructive link — used for dangerous actions
                    </a>
                  </div>
                </Specimen>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground">Status indicators</h4>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-accent" />
                    <span className="text-xs text-muted-foreground">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-destructive" />
                    <span className="text-xs text-muted-foreground">Failed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Pending</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">Focus ring examples (click to focus):</p>
              <div className="flex flex-wrap gap-2">
                <Button>Accent focus</Button>
                <Button variant="destructive">Destructive focus</Button>
              </div>
            </div>
          </div>
        </Section>

        <Separator />

        <Section title="Tooltip" description="Floating labels on hover.">
          <TooltipProvider>
            <div className="flex flex-wrap gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon-sm" variant="ghost">
                    <HelpCircle className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Help and documentation</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon-sm" variant="ghost">
                    <Settings className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings and preferences</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon-sm" variant="ghost">
                    <Copy className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy to clipboard</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </Section>

        <Separator />

        <Section title="Dropdown menu" description="Action menus triggered by a button click. Use for grouped actions or options.">
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Actions</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon-sm" variant="ghost">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>More options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View details</DropdownMenuItem>
                <DropdownMenuItem>Share</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Section>

        <Separator />

        <Section title="Popover" description="Rich content panels that appear on click. Use for forms, pickers, or detailed info.">
          <div className="flex flex-wrap gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Open popover</Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Popover panel</p>
                  <p className="text-xs text-muted-foreground">
                    Rich content can go here: forms, pickers, complex info, or anything else.
                  </p>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon-sm" variant="ghost">
                  <HelpCircle className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="right">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Help</p>
                  <p className="text-xs text-muted-foreground">
                    Explain features, provide guidance, or answer questions in detail.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </Section>

        <Separator />

        <Section title="Collapsible" description="Expandable sections that show or hide content. Use for progressive disclosure.">
          <div className="space-y-2">
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Advanced options
                  <ChevronDown className="size-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 space-y-2">
                <label className="text-sm">
                  <input type="checkbox" className="mr-2" />
                  Enable debug mode
                </label>
                <label className="text-sm">
                  <input type="checkbox" className="mr-2" />
                  Show hidden fields
                </label>
                <label className="text-sm">
                  <input type="checkbox" className="mr-2" />
                  Reset to defaults
                </label>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  More information
                  <ChevronDown className="size-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <p className="text-xs text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </Section>

        <Separator />

        <Section title="File view" description="The empty upload state and the viewer once a file exists.">
          <div className="space-y-4">
            <Card>
              <CardContent className="flex flex-col items-center gap-3 pt-8 pb-8">
                <UploadCloud className="size-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium">Upload file</p>
                  <p className="text-xs text-muted-foreground">
                    Drop a file here or{" "}
                    <button className="underline underline-offset-2 hover:text-foreground">
                      browse
                    </button>{" "}
                    — up to 10 MB
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-base">launch-brief.pdf</CardTitle>
                  <CardDescription>1.2 MB · PDF</CardDescription>
                </div>
                <Button size="icon-sm" variant="ghost">
                  <Download className="size-4" />
                </Button>
              </CardHeader>
            </Card>
          </div>
        </Section>

        <Separator />

        <Section title="Chat" description="The conversation surface: user messages in focus, assistant messages in muted, and a composer that opens a keyboard.">
          <ChatExample />
        </Section>

        <Separator />

        <Section
          title="Data visualization"
          description="Chart primitives drawn from the --chart-1 through --chart-5 tokens."
          editable
        >
          <div className="space-y-6">
            <EditableSessionsChart
              initialData={[
                { day: "Mon", value: 40, color: "bg-chart-5" },
                { day: "Tue", value: 85, color: "bg-chart-4" },
                { day: "Wed", value: 62, color: "bg-chart-3" },
                { day: "Thu", value: 91, color: "bg-chart-2" },
                { day: "Fri", value: 70, color: "bg-chart-1" },
              ]}
            />

            <EditableTrendChart
              initialValue={24}
            />

            <EditableTimeAllocation
              initialData={[
                { label: "Design", value: 45, color: "bg-chart-1", strokeColor: "stroke-chart-1" },
                { label: "Build", value: 35, color: "bg-chart-3", strokeColor: "stroke-chart-3" },
                { label: "Review", value: 20, color: "bg-chart-5", strokeColor: "stroke-chart-5" },
              ]}
            />
          </div>
        </Section>

        <Separator />

        <Section title="Maintenance log" description="A simple maintenance entry list with an edit sheet for adding new records." editable>
          <MaintenanceLog
            initialEntries={[
              { id: "1", type: "cleaned", label: "Cleaned", date: "Jul 18, 2026", by: "Dana Kim" },
              { id: "2", type: "oiled", label: "Oiled", date: "Jul 18, 2026", by: "Dana Kim" },
              { id: "3", type: "inspected", label: "Inspected", date: "Jun 30, 2026", by: "Jorge Alvarez" },
            ]}
          />
        </Section>

        <Separator />

        <Section
          title="History timeline"
          description="A vertical timeline for chronological records — usage history, maintenance logs, order events, etc."
          editable
        >
          <EditableHistoryTimeline
            title="Recent events"
            initialEvents={[
              {
                date: "Jul 2026 · Machine 12",
                title: "Current production run",
                description: "Marks Design Studio — housing order #2041",
                meta: "6,000 stamps",
              },
              {
                date: "May 2026 · Machine 12",
                title: "Production run",
                description: "Marks Design Studio",
                meta: "8,000 stamps",
              },
              {
                date: "Mar 2026 · Machine 07",
                title: "Production run",
                meta: "4,000 stamps",
              },
            ]}
          />
        </Section>

        <Separator />

        <Section
          title="Calendar view"
          description="Time-based calendar with day and week views — shows events from 6 AM to 6 PM with current time indicator."
        >
          <CalendarView
            view="week"
            showRoomFilter
            rooms={["Conference Room A", "Conference Room B", "Board Room", "Huddle Space", "Virtual"]}
            events={[
              {
                id: "1",
                title: "Friday standup",
                date: new Date(),
                time: "09:00",
                endTime: "09:30",
                type: "meeting",
                room: "Huddle Space",
                attendeeCount: 6,
                isClientMeeting: false,
              },
              {
                id: "2",
                title: "Olivia x Riley",
                date: new Date(),
                time: "10:00",
                endTime: "11:00",
                type: "meeting",
                description: "Design review session",
                room: "Bao",
                attendeeCount: 2,
                isClientMeeting: false,
              },
              {
                id: "3",
                title: "Product demo",
                date: new Date(),
                time: "13:30",
                endTime: "15:00",
                type: "meeting",
                description: "Client presentation",
                room: "Boardroom",
                attendeeCount: 8,
                isClientMeeting: true,
              },
              {
                id: "4",
                title: "Production run",
                date: new Date(Date.now() + 86400000),
                time: "08:00",
                endTime: "12:00",
                type: "production",
                description: "Machine 12 — housing order #2041",
              },
              {
                id: "5",
                title: "Maintenance check",
                date: new Date(Date.now() + 86400000 * 2),
                time: "14:00",
                endTime: "16:00",
                type: "maintenance",
                description: "Quarterly inspection",
              },
              {
                id: "6",
                title: "Team sync",
                date: new Date(Date.now() + 86400000 * 3),
                time: "09:30",
                endTime: "10:00",
                type: "meeting",
                room: "Virtual",
                attendeeCount: 12,
                isClientMeeting: false,
              },
              {
                id: "7",
                title: "Order deadline",
                date: new Date(Date.now() + 86400000 * 4),
                time: "17:00",
                endTime: "18:00",
                type: "deadline",
                description: "Marks Design Studio — 6,000 units",
                room: "Conference A",
              },
            ]}
          />
        </Section>

        <Separator />

        <Section
          title="Meeting cards"
          description="Calendar event cards showing meeting details — title, room with icon, attendees, and client indicator. Height adapts to show more detail for longer meetings."
        >
          <div className="space-y-6">
            {/* Sample cards at different heights */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Card heights
              </h3>
              <p className="text-sm text-muted-foreground/70">
                Cards adapt their content based on available height — shorter meetings show less detail.
              </p>
              <div className="rounded-xl border bg-card p-6">
                <div className="relative" style={{ height: '320px' }}>
                  <MeetingCard
                    title="Quick sync"
                    room="Virtual"
                    attendeeCount={2}
                    isClientMeeting={false}
                    height={30}
                    top={0}
                  />
                  <MeetingCard
                    title="1:1 with Sam"
                    room="Lounge"
                    attendeeCount={2}
                    isClientMeeting={false}
                    height={48}
                    top={40}
                  />
                  <MeetingCard
                    title="Team standup"
                    room="Conference A"
                    attendeeCount={6}
                    isClientMeeting={false}
                    height={64}
                    top={100}
                  />
                  <MeetingCard
                    title="Client Review - Northwind"
                    room="Boardroom"
                    attendeeCount={5}
                    isClientMeeting={true}
                    height={90}
                    top={175}
                  />
                </div>
              </div>
            </div>

            {/* Room icons */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Room icons
              </h3>
              <p className="text-sm text-muted-foreground/70">
                Each room has a unique icon — Bao uses a dog icon, Conference rooms use presentation, etc.
              </p>
              <div className="flex flex-wrap gap-2">
                {ROOM_NAMES.map((room) => (
                  <span
                    key={room}
                    className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-700 dark:text-violet-400"
                  >
                    {room}
                  </span>
                ))}
              </div>
            </div>

            {/* Different room examples */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Room examples
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {[
                  { title: "Olivia x Riley", room: "Bao", attendees: 2, client: false },
                  { title: "Q3 Planning", room: "Conference A", attendees: 8, client: false },
                  { title: "Client Demo", room: "Boardroom", attendees: 5, client: true },
                  { title: "Coffee chat", room: "Lounge", attendees: 3, client: false },
                  { title: "Remote sync", room: "Virtual", attendees: 12, client: false },
                  { title: "Quick call", room: "Phone Booth", attendees: 1, client: true },
                ].map((meeting, idx) => (
                  <div key={idx} className="relative h-24 rounded-lg border bg-card p-1">
                    <MeetingCard
                      title={meeting.title}
                      room={meeting.room}
                      attendeeCount={meeting.attendees}
                      isClientMeeting={meeting.client}
                      height={80}
                      top={0}
                      className="!absolute !left-1 !right-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Separator />

        <Section
          title="Room page"
          description="A room detail view showing room info, previous/next meetings, photo carousel with map, and booking actions."
        >
          <div className="space-y-6">
            {/* Room page with meetings */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                With meetings
              </h3>
              <p className="text-sm text-muted-foreground/70">
                Shows previous and upcoming meetings with attendee details, a photo/map carousel, and action buttons.
              </p>
              <RoomPage
                room={rooms.find((r) => r.name === "Bao") ?? rooms[0]}
                previousMeeting={{
                  id: "1",
                  title: "Team Standup",
                  startTime: "09:00",
                  endTime: "09:30",
                  attendees: ["Alice Chen", "Bob Smith", "Charlie Kim"],
                }}
                nextMeeting={{
                  id: "2",
                  title: "Client Demo - Northwind",
                  startTime: "14:00",
                  endTime: "15:00",
                  attendees: ["Alice Chen", "Client Rep"],
                }}
                onBookRoom={() => console.log("Book room clicked")}
                onViewSchedule={() => console.log("View schedule clicked")}
              />
            </div>

            {/* Room page without meetings */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                No meetings
              </h3>
              <p className="text-sm text-muted-foreground/70">
                When no meetings are scheduled, the meeting slots show a placeholder state.
              </p>
              <RoomPage
                room={rooms.find((r) => r.name === "Charlie") ?? rooms[1]}
                onBookRoom={() => console.log("Book room clicked")}
                onViewSchedule={() => console.log("View schedule clicked")}
              />
            </div>

            {/* Different room types */}
            <div className="space-y-3">
              <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Room types
              </h3>
              <p className="text-sm text-muted-foreground/70">
                Each room type displays its unique icon and capacity badge.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <RoomPage
                  room={rooms.find((r) => r.name === "Hello Kitty") ?? rooms[3]}
                  nextMeeting={{
                    id: "3",
                    title: "1:1 with Sam",
                    startTime: "11:00",
                    endTime: "11:30",
                    attendees: ["Sam Wilson"],
                  }}
                  onBookRoom={() => console.log("Book room clicked")}
                  onViewSchedule={() => console.log("View schedule clicked")}
                />
                <RoomPage
                  room={rooms.find((r) => r.name === "Lounge") ?? rooms[4]}
                  previousMeeting={{
                    id: "4",
                    title: "Coffee Chat",
                    startTime: "10:00",
                    endTime: "10:30",
                    attendees: ["Dana Kim", "Jorge Alvarez", "Maya Patel", "Leo Chen"],
                  }}
                  onBookRoom={() => console.log("Book room clicked")}
                  onViewSchedule={() => console.log("View schedule clicked")}
                />
              </div>
            </div>
          </div>
        </Section>

        <Separator />

        <Section
          title="Associated files"
          description="A file list with drag-and-drop upload. Shows attached documents with metadata and supports adding new files."
          editable
        >
          <div className="max-w-2xl">
            <AssociatedFiles
              initialFiles={[
                { name: "project-spec.pdf", meta: "2.4 MB · PDF" },
                { name: "design-drawings.zip", meta: "12.4 MB · Archive" },
                { name: "maintenance-log.xlsx", meta: "640 KB · Spreadsheet" },
              ]}
            />
          </div>
        </Section>

        <Separator />

        <Section title="Color tokens" description="The core palette from globals.css, resolved live.">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {colorTokens.map((token) => (
              <div key={token.name} className="space-y-1.5">
                <div className={`h-14 rounded-lg ring-1 ring-foreground/10 ${token.className}`} />
                <p className="font-mono text-xs text-muted-foreground">--{token.name}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </KeyboardNavigablePage>
  );
}
