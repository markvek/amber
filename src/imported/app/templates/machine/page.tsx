import type { Metadata } from "next";
import { ImageIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { KeyboardNavigablePage } from "@/components/KeyboardNavigablePage";
import { PageEditButton } from "@/components/workspace/page-edit-button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AssociatedFiles } from "@/components/workspace/associated-files";
import { EditableMetric, EditableProductionChart } from "@/components/workspace/editable-metric";
import { MaintenanceBoard } from "@/components/workspace/maintenance-board";
import {
  EditableField,
  EditableTitle,
} from "@/components/workspace/template-fields";

export const metadata: Metadata = {
  title: "Machine template",
};

export default function MachineTemplatePage() {
  return (
    <KeyboardNavigablePage>
      <div className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-6 py-16">
        <header className="space-y-2">
          <p className="text-xs text-muted-foreground">Design System / layouts / machine</p>
          <Badge variant="outline">Machine layout</Badge>
          <div className="flex items-start gap-4">
            <EditableTitle placeholder="Untitled machine" className="min-w-0 flex-1" />
            <PageEditButton />
          </div>
          <p className="text-muted-foreground">
            A blank machine record — fill in each field to stand up a new machine page.
          </p>
        </header>

        <section data-keyboard-nav-section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <EditableMetric
          label="Utilization rate"
          initialValue={0}
          unit="%"
          progress={0}
          subtitle="No data yet"
          className="col-span-2"
          editDescription="Set the current utilization percentage"
        />

        <EditableProductionChart
          label="Total production"
          initialTotal={0}
          unitLabel="units this month"
          initialData={[
            { day: "Mon", value: 0, color: "bg-chart-5" },
            { day: "Tue", value: 0, color: "bg-chart-4" },
            { day: "Wed", value: 0, color: "bg-chart-3" },
            { day: "Thu", value: 0, color: "bg-chart-2" },
            { day: "Fri", value: 0, color: "bg-chart-1" },
          ]}
          className="col-span-2"
        />

        <figure className="col-span-2 space-y-2">
          <div className="flex aspect-video items-center justify-center rounded-xl bg-secondary text-secondary-foreground/40">
            <ImageIcon className="size-8" />
          </div>
          <figcaption className="text-xs text-muted-foreground/50">
            Add a machine photo
          </figcaption>
        </figure>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Current use</CardTitle>
            <CardDescription>Who and what this machine is running</CardDescription>
            <CardAction>
              <Badge variant="outline">Status</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm text-muted-foreground">Customer</span>
              <EditableField placeholder="Add customer" />
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm text-muted-foreground">Mold</span>
              <EditableField placeholder="Add mold" />
            </div>
          </CardContent>
          <CardFooter className="gap-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
              —
            </span>
            <EditableField placeholder="Assign an operator" align="left" />
          </CardFooter>
        </Card>

        <MaintenanceBoard
          className="col-span-2 md:col-span-4"
          columns={[
            { label: "Past maintenance", placeholderCount: 3 },
            { label: "Daily checks", placeholderCount: 4 },
            { label: "Quarterly checks", placeholderCount: 4 },
          ]}
        />

          <AssociatedFiles initialFiles={[]} />
        </section>
      </div>
    </KeyboardNavigablePage>
  );
}
