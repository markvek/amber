import type { Metadata } from "next";
import Link from "next/link";
import { Factory } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { KeyboardNavigablePage } from "@/components/KeyboardNavigablePage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AssociatedFiles } from "@/components/workspace/associated-files";
import { UsageHistoryCard } from "@/components/workspace/history-timeline";
import { MaintenanceLog } from "@/components/workspace/maintenance-log";
import { StampLifespan } from "@/components/workspace/stamp-lifespan";
import { MoldLocation } from "./mold-location";

export const metadata: Metadata = {
  title: "MX-4 Housing — Rev C",
};

const RATED = 50000;
const USED = 20000;

const maintenanceEntries = [
  { id: "1", type: "cleaned" as const, label: "Cleaned", date: "Jul 18, 2026", by: "Dana Kim" },
  { id: "2", type: "oiled" as const, label: "Oiled", date: "Jul 18, 2026", by: "Dana Kim" },
  { id: "3", type: "inspected" as const, label: "Inspected", date: "Jun 30, 2026", by: "Jorge Alvarez" },
  { id: "4", type: "cleaned" as const, label: "Cleaned", date: "May 15, 2026", by: "Sam Osei" },
  { id: "5", type: "inspected" as const, label: "Inspected", date: "Apr 20, 2026", by: "Jorge Alvarez" },
];

const usageHistory = [
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
    description: "Marks Design Studio",
    meta: "4,000 stamps",
  },
  {
    date: "Jan 2026 · Machine 12",
    title: "First run",
    description: "Initial validation batch",
    meta: "2,000 stamps",
  },
];

export default function MoldPage() {
  return (
    <KeyboardNavigablePage>
      <div className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-6 py-16">
        <header className="space-y-2">
          <p className="text-xs text-muted-foreground">Workspace / molds / mx-4-housing</p>
          <h1 className="text-3xl font-semibold tracking-tight">MX-4 Housing — Rev C</h1>
          <p className="text-muted-foreground">
            Mold record — location, lifespan, usage history, and maintenance.
          </p>
        </header>

        <section data-keyboard-nav-section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StampLifespan initialUsed={USED} initialRated={RATED} />

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>Where this mold is and what it&apos;s on</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge className="bg-accent text-accent-foreground">In use</Badge>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">Location</span>
              <MoldLocation initial="Floor A — Machine 12" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">Current machine</span>
              <Link
                href="/machine-12"
                className="flex items-center gap-1.5 text-sm font-medium text-accent underline-offset-2 hover:underline"
              >
                <Factory className="size-3.5" />
                Machine 12
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Customer</CardTitle>
            <CardDescription>Account this mold belongs to</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                MV
              </span>
              <div className="min-w-0">
                <Link
                  href="/customers/marks-design-studio"
                  className="text-sm font-medium text-accent underline-offset-2 hover:underline"
                >
                  Marks Design Studio
                </Link>
                <p className="text-xs text-muted-foreground">Mark Veksler · Product Designer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <MaintenanceLog initialEntries={maintenanceEntries} />

        <UsageHistoryCard
          className="col-span-2 md:col-span-4"
          initialEvents={usageHistory}
        />

        <AssociatedFiles
          initialFiles={[
            { name: "mx-4-housing-drawings.zip", meta: "12.4 MB · Archive" },
            { name: "mold-flow-analysis.pdf", meta: "3.2 MB · PDF" },
            { name: "tooling-cert.pdf", meta: "180 KB · PDF" },
          ]}
        />
        </section>
      </div>
    </KeyboardNavigablePage>
  );
}
