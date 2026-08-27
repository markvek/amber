"use client";

import { ImageIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { EditableCard } from "@/components/workspace/editable-card";
import {
  EditableField,
  EmptyBars,
  PlaceholderRows,
} from "@/components/workspace/template-fields";
import type { TemplateType } from "@/components/workspace/workspace-store";

const columnLabel = "text-xs font-medium tracking-wider text-muted-foreground uppercase";

function MachineTemplateContent() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <EditableCard
        className="col-span-2 rounded-xl p-5 ring-1 ring-foreground/10"
        editTitle="Edit utilization rate"
        editDescription="Set the current utilization percentage"
        editContent={
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="utilization">Utilization rate (%)</Label>
              <Input id="utilization" type="number" placeholder="0" min={0} max={100} />
            </div>
          </div>
        }
      >
        <p className="text-sm font-medium">Utilization rate</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight text-muted-foreground/30">
          —%
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted" />
        <p className="mt-2 text-xs text-muted-foreground/50">No data yet</p>
      </EditableCard>

      <EditableCard
        className="col-span-2 rounded-xl p-5 ring-1 ring-foreground/10"
        editTitle="Edit production"
        editDescription="Update total production numbers"
        editContent={
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="production">Total units produced</Label>
              <Input id="production" type="number" placeholder="0" />
            </div>
          </div>
        }
      >
        <p className="text-sm font-medium">Total production</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight text-muted-foreground/30">
          — <span className="text-base font-normal">units</span>
        </p>
        <EmptyBars />
      </EditableCard>

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

      <EditableCard
        className="col-span-2 rounded-xl p-5 ring-1 ring-foreground/10 md:col-span-4"
        editTitle="Edit maintenance"
        editDescription="Add and manage maintenance records"
        editContent={
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add maintenance entries for this machine.
            </p>
          </div>
        }
      >
        <p className="text-sm font-medium">Maintenance</p>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          <div>
            <p className={columnLabel}>Past maintenance</p>
            <PlaceholderRows count={3} />
          </div>
          <div>
            <p className={columnLabel}>Daily checks</p>
            <PlaceholderRows count={4} />
          </div>
          <div>
            <p className={columnLabel}>Quarterly checks</p>
            <PlaceholderRows count={4} />
          </div>
        </div>
      </EditableCard>

      <AssociatedFiles initialFiles={[]} />
    </div>
  );
}

function CustomerTemplateContent() {
  const recordLabels = [
    { label: "Orders" },
    { label: "Accounts payable" },
    { label: "Bills paid" },
    { label: "Contracts signed" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Customer information</CardTitle>
          <CardDescription>Primary contact for this account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground">
              —
            </span>
            <div className="min-w-0 flex-1">
              <EditableField placeholder="Contact name" align="left" />
              <EditableField placeholder="Add a role" align="left" />
            </div>
          </div>
          <ul className="space-y-1.5">
            <li className="flex items-center gap-2">
              <EditableField placeholder="Add an email" align="left" />
            </li>
            <li className="flex items-center gap-2">
              <EditableField placeholder="Add a phone number" align="left" />
            </li>
            <li className="flex items-center gap-2">
              <EditableField placeholder="Add a location" align="left" />
            </li>
          </ul>
        </CardContent>
      </Card>

      <EditableCard
        className="col-span-2 rounded-xl p-5 ring-1 ring-foreground/10"
        editTitle="Edit records"
        editDescription="Update customer records"
        editContent={
          <div className="space-y-4">
            {recordLabels.map(({ label }) => (
              <div key={label} className="grid gap-2">
                <Label htmlFor={`record-${label}`}>{label}</Label>
                <Input id={`record-${label}`} type="number" placeholder="0" />
              </div>
            ))}
          </div>
        }
      >
        <p className="text-sm font-medium">Records</p>
        <ul className="mt-3 divide-y divide-border">
          {recordLabels.map(({ label }) => (
            <li key={label} className="flex items-center gap-3 py-2 text-sm">
              <span className="flex-1 font-medium">{label}</span>
              <span className="text-xs text-muted-foreground/40">—</span>
            </li>
          ))}
        </ul>
      </EditableCard>

      <EditableCard
        className="col-span-2 rounded-xl p-5 ring-1 ring-foreground/10 md:col-span-4"
        editTitle="Edit current project"
        editDescription="Update the running project details"
        editContent={
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="project-name">Project name</Label>
              <Input id="project-name" placeholder="Enter project name" />
            </div>
          </div>
        }
      >
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-medium">Current project running</p>
          <p className="text-xs text-muted-foreground/40">No project yet</p>
        </div>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          <div>
            <p className={columnLabel}>Machines in use</p>
            <PlaceholderRows count={3} />
          </div>
          <div>
            <p className={columnLabel}>Assembly</p>
            <PlaceholderRows count={2} />
          </div>
          <div>
            <p className={columnLabel}>Molds</p>
            <PlaceholderRows count={4} />
          </div>
        </div>
      </EditableCard>

      <EditableCard
        className="col-span-2 rounded-xl p-5 ring-1 ring-foreground/10 md:col-span-4"
        editTitle="Edit assigned people"
        editDescription="Manage team members on this account"
        editContent={
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add team members to this customer account.
            </p>
          </div>
        }
      >
        <p className="text-sm font-medium">People assigned to the account</p>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="flex items-center gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
                —
              </span>
              <div className="min-w-0 flex-1">
                <EditableField placeholder="Add a person" align="left" />
              </div>
            </li>
          ))}
        </ul>
      </EditableCard>

      <AssociatedFiles initialFiles={[]} />
    </div>
  );
}

function MoldTemplateContent() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <figure className="col-span-2 space-y-2">
        <div className="flex aspect-video items-center justify-center rounded-xl bg-secondary text-secondary-foreground/40">
          <ImageIcon className="size-8" />
        </div>
        <figcaption className="text-xs text-muted-foreground/50">
          Add a mold photo
        </figcaption>
      </figure>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Mold details</CardTitle>
          <CardDescription>Specifications and current status</CardDescription>
          <CardAction>
            <Badge variant="outline">Status</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-2.5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-muted-foreground">Part number</span>
            <EditableField placeholder="Add part number" />
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-muted-foreground">Revision</span>
            <EditableField placeholder="Add revision" />
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-muted-foreground">Material</span>
            <EditableField placeholder="Add material" />
          </div>
        </CardContent>
      </Card>

      <EditableCard
        className="col-span-2 rounded-xl p-5 ring-1 ring-foreground/10 md:col-span-4"
        editTitle="Edit usage history"
        editDescription="Manage mold usage records"
        editContent={
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add usage history entries for this mold.
            </p>
          </div>
        }
      >
        <p className="text-sm font-medium">Usage history</p>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          <div>
            <p className={columnLabel}>Machines used</p>
            <PlaceholderRows count={3} />
          </div>
          <div>
            <p className={columnLabel}>Customers</p>
            <PlaceholderRows count={2} />
          </div>
          <div>
            <p className={columnLabel}>Maintenance</p>
            <PlaceholderRows count={3} />
          </div>
        </div>
      </EditableCard>

      <AssociatedFiles initialFiles={[]} />
    </div>
  );
}

export function TemplateContent({ template }: { template: TemplateType }) {
  switch (template) {
    case "machine":
      return <MachineTemplateContent />;
    case "customer":
      return <CustomerTemplateContent />;
    case "mold":
      return <MoldTemplateContent />;
    default:
      return null;
  }
}
