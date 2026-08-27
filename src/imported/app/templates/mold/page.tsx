import type { Metadata } from "next";

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
import { Lifespan } from "@/components/workspace/lifespan";
import { MaintenanceLog } from "@/components/workspace/maintenance-log";
import {
  EditableField,
  EditableTitle,
} from "@/components/workspace/template-fields";

export const metadata: Metadata = {
  title: "Mold template",
};

export default function MoldTemplatePage() {
  return (
    <KeyboardNavigablePage>
      <div className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-6 py-16">
        <header className="space-y-2">
          <p className="text-xs text-muted-foreground">Design System / layouts / mold</p>
          <Badge variant="outline">Mold layout</Badge>
          <EditableTitle placeholder="Untitled mold" />
          <p className="text-muted-foreground">
            A blank mold record — fill in each field to stand up a new mold page.
          </p>
        </header>

        <section data-keyboard-nav-section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Lifespan
          label="Stamp lifespan"
          initialCurrent={0}
          initialTotal={0}
          unit="stamps"
          currentLabel="Stamps used"
          className="col-span-2"
        />

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>Where this mold is and what it&apos;s on</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant="outline">Status</Badge>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm text-muted-foreground">Location</span>
              <EditableField placeholder="Add a location" />
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm text-muted-foreground">Current machine</span>
              <EditableField placeholder="Assign a machine" />
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
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground">
                —
              </span>
              <div className="min-w-0 flex-1">
                <EditableField placeholder="Add a customer" align="left" />
              </div>
            </div>
          </CardContent>
        </Card>

        <MaintenanceLog initialEntries={[]} />

        <UsageHistoryCard
          title="Usage history"
          description="Runs will appear here as the mold is used."
          initialEvents={[]}
          className="col-span-2 md:col-span-4"
        />

        <AssociatedFiles initialFiles={[]} />
        </section>
      </div>
    </KeyboardNavigablePage>
  );
}
