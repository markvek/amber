import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, CheckCircle2, ImageIcon, Wrench } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { AssociatedFiles } from "@/components/workspace/associated-files";
import { EditableMetric, EditableProductionChart } from "@/components/workspace/editable-metric";
import { MaintenanceBoard } from "@/components/workspace/maintenance-board";
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

export const metadata: Metadata = {
  title: "Injection Mold Machine 12",
};

const productionByDay = [
  { day: "Mon", h: "62%", color: "bg-chart-5" },
  { day: "Tue", h: "78%", color: "bg-chart-4" },
  { day: "Wed", h: "70%", color: "bg-chart-3" },
  { day: "Thu", h: "88%", color: "bg-chart-2" },
  { day: "Fri", h: "100%", color: "bg-chart-1" },
] as const;

const pastMaintenance = [
  { date: "Jun 12", note: "Hydraulic oil replaced" },
  { date: "May 28", note: "Nozzle heater band swapped" },
  { date: "Apr 09", note: "Full quarterly service" },
] as const;

const dailyChecks = [
  "Check hydraulic oil level",
  "Inspect nozzle for drool",
  "Verify mold clamp pressure",
  "Clear purge waste",
] as const;

const quarterlyChecks = [
  "Replace hydraulic filters",
  "Calibrate temperature controllers",
  "Inspect tie-bar wear",
  "Grease toggle linkage",
] as const;

export default function Machine12Page() {
  return (
    <KeyboardNavigablePage>
      <div className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-6 py-16">
        <header className="space-y-2">
          <p className="text-xs text-muted-foreground">Workspace / machine / 12</p>
          <h1 className="text-3xl font-semibold tracking-tight">Injection Mold Machine 12</h1>
          <p className="text-muted-foreground">
            Live view of utilization, current job, and the maintenance record for this machine.
          </p>
        </header>

        {/* Section 1: Metrics & Production */}
        <section data-keyboard-nav-section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <EditableMetric
          label="Utilization rate"
          initialValue={87}
          unit="%"
          progress={87}
          subtitle="+3% vs last week"
          className="col-span-1 md:col-span-2"
          editDescription="Update the current utilization percentage"
        />

        <EditableProductionChart
          label="Total production"
          initialTotal={14280}
          unitLabel="units this month"
          initialData={[
            { day: "Mon", value: 62, color: "bg-chart-5" },
            { day: "Tue", value: 78, color: "bg-chart-4" },
            { day: "Wed", value: 70, color: "bg-chart-3" },
            { day: "Thu", value: 88, color: "bg-chart-2" },
            { day: "Fri", value: 100, color: "bg-chart-1" },
          ]}
          className="col-span-1 md:col-span-2"
        />

        <figure className="col-span-2 space-y-2">
          <div className="flex aspect-video items-center justify-center rounded-xl bg-secondary text-secondary-foreground/50">
            <ImageIcon className="size-8" />
          </div>
          <figcaption className="text-xs text-muted-foreground">
            * Machine 12 — photo to be attached.
          </figcaption>
        </figure>
        </section>

        {/* Section 2: Current Use */}
        <section data-keyboard-nav-section>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Current use</CardTitle>
            <CardDescription>Running since 06:40 today</CardDescription>
            <CardAction>
              <Badge className="bg-accent text-accent-foreground">Active</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-muted-foreground">Customer</span>
              <Link
                href="/customers/marks-design-studio"
                className="font-medium text-accent underline underline-offset-2 hover:text-border-accent"
              >
                Marks Design Studio
              </Link>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-muted-foreground">Mold</span>
              <Link
                href="/molds/mx-4-housing"
                className="font-medium text-accent underline underline-offset-2 hover:text-border-accent"
              >
                MX-4 Housing — Rev C
              </Link>
            </div>
          </CardContent>
          <CardFooter className="gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
              JA
            </span>
            <div className="min-w-0">
              <p className="text-sm leading-tight font-medium">Jorge Alvarez</p>
              <p className="text-xs text-muted-foreground">Operator on shift</p>
            </div>
          </CardFooter>
        </Card>
        </section>

        {/* Section 3: Maintenance Board */}
        <section data-keyboard-nav-section>
        <MaintenanceBoard
          className="col-span-2 md:col-span-4"
          columns={[
            {
              label: "Past maintenance",
              items: pastMaintenance.map(({ date, note }) => ({
                icon: <Wrench className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />,
                text: (
                  <>
                    <span className="font-mono text-xs text-muted-foreground">{date}</span> — {note}
                  </>
                ),
              })),
            },
            {
              label: "Daily checks",
              items: dailyChecks.map((check) => ({
                icon: <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />,
                text: check,
              })),
            },
            {
              label: "Quarterly checks",
              items: quarterlyChecks.map((check) => ({
                icon: <CalendarClock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />,
                text: check,
              })),
            },
          ]}
        />
        </section>

        {/* Section 4: Associated Files */}
        <section data-keyboard-nav-section>
        <AssociatedFiles
          initialFiles={[
            { name: "machine-12-manual.pdf", meta: "4.8 MB · PDF" },
            { name: "mx-4-mold-spec.pdf", meta: "2.1 MB · PDF" },
            { name: "maintenance-log-q2.xlsx", meta: "640 KB · Spreadsheet" },
          ]}
        />
        </section>
      </div>
    </KeyboardNavigablePage>
  );
}
