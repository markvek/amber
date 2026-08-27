import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
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

import { Badge } from "@/components/ui/badge";
import { AssociatedFiles } from "@/components/workspace/associated-files";
import { KeyboardNavigablePage } from "@/components/KeyboardNavigablePage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Marks Design Studio",
};

const records = [
  { label: "Orders", meta: "12 total", icon: Receipt },
  { label: "Accounts payable", meta: "3 open", icon: CreditCard },
  { label: "Bills paid", meta: "28 on record", icon: CheckCircle2 },
  { label: "Contracts signed", meta: "5 active", icon: FileText },
] as const;

const machines = [
  { name: "Machine 12", href: "/machine-12", running: "MX-4 Housing — Rev C" },
  { name: "Machine 07", href: "#", running: "MX-2 Bracket" },
  { name: "Machine 15", href: "#", running: "MX-1 Cover" },
] as const;

const molds: { name: string; status: string; href?: string }[] = [
  { name: "MX-4 Housing", status: "In use", href: "/molds/mx-4-housing" },
  { name: "MX-2 Bracket", status: "In use" },
  { name: "MX-1 Cover", status: "In use" },
  { name: "MX-3 Base", status: "In storage" },
];

const team = [
  { initials: "PS", name: "Priya Shah", role: "Sales manager" },
  { initials: "DC", name: "Daniel Cho", role: "Project manager" },
  { initials: "JA", name: "Jorge Alvarez", role: "Technician — Machine 12" },
  { initials: "DK", name: "Dana Kim", role: "Technician — Machine 07" },
  { initials: "SO", name: "Sam Osei", role: "Technician — Machine 15" },
] as const;

export default function MarksDesignStudioPage() {
  return (
    <KeyboardNavigablePage>
      <div className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-6 py-16">
        <header className="space-y-2">
          <p className="text-xs text-muted-foreground">Workspace / customers / marks-design-studio</p>
          <h1 className="text-3xl font-semibold tracking-tight">Marks Design Studio</h1>
          <p className="text-muted-foreground">
            Customer account — records, the running project, and the people on it.
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
              <span className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                MV
              </span>
              <div>
                <p className="text-sm leading-tight font-medium">Mark Veksler</p>
                <p className="text-xs text-muted-foreground">Product Designer</p>
              </div>
            </div>
            <ul className="space-y-1.5 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="size-3.5 shrink-0 text-muted-foreground" />
                <a href="mailto:mark@marksdesign.studio" className="text-accent hover:underline">
                  mark@marksdesign.studio
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-3.5 shrink-0 text-muted-foreground" />
                <span>(555) 014-8829</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                <span>Brooklyn, NY</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="col-span-2 rounded-xl p-5 ring-1 ring-foreground/10">
          <p className="text-sm font-medium">Records</p>
          <ul className="mt-3 divide-y divide-border">
            {records.map(({ label, meta, icon: Icon }) => (
              <li key={label}>
                <a
                  href="#"
                  className="group flex items-center gap-3 rounded-md py-2 text-sm outline-none hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring/50"
                >
                  <Icon className="size-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1 font-medium">{label}</span>
                  <span className="text-xs text-muted-foreground">{meta}</span>
                  <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 rounded-xl p-5 ring-1 ring-foreground/10 md:col-span-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-medium">Current project running</p>
            <p className="text-xs text-muted-foreground">
              3 machines · assembly line · 4 molds
            </p>
          </div>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            <div className="border-b border-border pb-4 sm:border-b-0 sm:pb-0">
              <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Machines in use
              </p>
              <ul className="mt-2.5 space-y-2 text-sm">
                {machines.map(({ name, href, running }) => (
                  <li key={name} className="flex items-start gap-2">
                    <Factory className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                    <span>
                      <Link
                        href={href}
                        className="font-medium text-accent underline-offset-2 hover:underline"
                      >
                        {name}
                      </Link>{" "}
                      <span className="text-muted-foreground">— {running}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-b border-border pb-4 sm:border-b-0 sm:border-l sm:pb-0 sm:pl-6">
              <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Assembly
              </p>
              <ul className="mt-2.5 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Package className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <span>Housing sub-assembly — line 2 running</span>
                </li>
                <li className="flex items-start gap-2">
                  <Package className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <span>Fastener kitting — staged for Friday</span>
                </li>
              </ul>
            </div>
            <div className="sm:border-l sm:pl-6">
              <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Molds
              </p>
              <ul className="mt-2.5 space-y-2 text-sm">
                {molds.map(({ name, status, href }) => (
                  <li key={name} className="flex items-center gap-2">
                    <Box className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="flex-1">
                      {href ? (
                        <Link
                          href={href}
                          className="text-accent underline-offset-2 hover:underline"
                        >
                          {name}
                        </Link>
                      ) : (
                        name
                      )}
                    </span>
                    <Badge
                      variant={status === "In use" ? "secondary" : "outline"}
                      className={status === "In use" ? "bg-accent text-accent-foreground" : undefined}
                    >
                      {status}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-span-2 rounded-xl p-5 ring-1 ring-foreground/10 md:col-span-4">
          <p className="text-sm font-medium">People assigned to the account</p>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {team.map(({ initials, name, role }) => (
              <li key={name} className="flex items-center gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                  {initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm leading-tight font-medium">{name}</p>
                  <p className="truncate text-xs text-muted-foreground">{role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <AssociatedFiles
          initialFiles={[
            { name: "master-services-agreement.pdf", meta: "1.8 MB · PDF" },
            { name: "po-2041.pdf", meta: "220 KB · PDF" },
            { name: "mx-4-housing-drawings.zip", meta: "12.4 MB · Archive" },
          ]}
        />
        </section>
      </div>
    </KeyboardNavigablePage>
  );
}
