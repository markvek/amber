import type { Metadata } from "next";
import {
  Box,
  CheckCircle2,
  CreditCard,
  Factory,
  FileText,
  Mail,
  MapPin,
  Package,
  Phone,
  Receipt,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AssociatedFiles } from "@/components/workspace/associated-files";
import { KeyboardNavigablePage } from "@/components/KeyboardNavigablePage";
import { PageEditButton } from "@/components/workspace/page-edit-button";
import {
  EditableField,
  EditableTitle,
  PlaceholderRows,
} from "@/components/workspace/template-fields";

export const metadata: Metadata = {
  title: "Customer template",
};

const columnLabel = "text-xs font-medium tracking-wider text-muted-foreground uppercase";

const recordLabels = [
  { label: "Orders", icon: Receipt },
  { label: "Accounts payable", icon: CreditCard },
  { label: "Bills paid", icon: CheckCircle2 },
  { label: "Contracts signed", icon: FileText },
];

export default function CustomerTemplatePage() {
  return (
    <KeyboardNavigablePage>
      <div className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-6 py-16">
        <header className="space-y-2">
          <p className="text-xs text-muted-foreground">Design System / layouts / customer</p>
          <Badge variant="outline">Customer layout</Badge>
          <div className="flex items-start gap-4">
            <EditableTitle placeholder="Untitled customer" className="min-w-0 flex-1" />
            <PageEditButton />
          </div>
          <p className="text-muted-foreground">
            A blank customer account — fill in each field to stand up a new customer page.
          </p>
        </header>

        <section data-keyboard-nav-section className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
                <Mail className="size-3.5 shrink-0 text-muted-foreground" />
                <EditableField placeholder="Add an email" align="left" />
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-3.5 shrink-0 text-muted-foreground" />
                <EditableField placeholder="Add a phone number" align="left" />
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                <EditableField placeholder="Add a location" align="left" />
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="col-span-2 rounded-xl p-5 ring-1 ring-foreground/10">
          <p className="text-sm font-medium">Records</p>
          <ul className="mt-3 divide-y divide-border">
            {recordLabels.map(({ label, icon: Icon }) => (
              <li key={label} className="flex items-center gap-3 py-2 text-sm">
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 font-medium">{label}</span>
                <span className="text-xs text-muted-foreground/40">—</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 rounded-xl p-5 ring-1 ring-foreground/10 md:col-span-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-medium">Current project running</p>
            <p className="text-xs text-muted-foreground/40">No project yet</p>
          </div>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            <div>
              <p className={columnLabel}>
                <Factory className="mr-1 inline size-3" /> Machines in use
              </p>
              <PlaceholderRows count={3} />
            </div>
            <div>
              <p className={columnLabel}>
                <Package className="mr-1 inline size-3" /> Assembly
              </p>
              <PlaceholderRows count={2} />
            </div>
            <div>
              <p className={columnLabel}>
                <Box className="mr-1 inline size-3" /> Molds
              </p>
              <PlaceholderRows count={4} />
            </div>
          </div>
        </div>

        <div className="col-span-2 rounded-xl p-5 ring-1 ring-foreground/10 md:col-span-4">
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
        </div>

        <AssociatedFiles initialFiles={[]} />
        </section>
      </div>
    </KeyboardNavigablePage>
  );
}
