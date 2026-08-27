import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Box,
  Building2,
  CalendarDays,
  Cake,
  Factory,
  Quote,
  UtensilsCrossed,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { KeyboardNavigablePage } from "@/components/KeyboardNavigablePage";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Home",
};

const machines = [
  { name: "Machine 07", status: "Idle", href: null },
  { name: "Machine 12", status: "Running", href: "/machine-12" },
  { name: "Machine 15", status: "Running", href: null },
  { name: "Machine 21", status: "Maintenance", href: null },
];

const statusDot: Record<string, string> = {
  Running: "bg-accent",
  Idle: "bg-muted-foreground/40",
  Maintenance: "bg-destructive",
};

const customers = [
  {
    name: "Marks Design Studio",
    href: "/customers/marks-design-studio",
    contact: "Mark Veksler",
    email: "mark@marksdesign.com",
    activeOrders: 3,
    status: "Active",
  },
  {
    name: "Northwind Tooling",
    href: null,
    contact: "Sarah Chen",
    email: "schen@northwind.com",
    activeOrders: 1,
    status: "Active",
  },
  {
    name: "Cedar Molding Co.",
    href: null,
    contact: "James Rodriguez",
    email: "j.rodriguez@cedarmolding.com",
    activeOrders: 0,
    status: "Inactive",
  },
];

const moldStorage = [
  { name: "MX-3 Base", rack: "Rack 12", href: null },
  { name: "MX-4 Housing", rack: "On Machine 12", href: "/molds/mx-4-housing" },
  { name: "MX-1 Cover", rack: "Rack 04", href: null },
];

const lunchSchedule = [
  { time: "12:30 PM", label: "Lunch served — Cafeteria", icon: UtensilsCrossed },
  { time: "6:00 PM", label: "Jake's Birthday Cake cutting — Break room", icon: Cake },
];

const org = {
  name: "Alex Rivera",
  role: "Chief Executive",
  reports: [
    { name: "Priya Shah", role: "VP, Sales", reports: ["Daniel Cho", "Sales operations"] },
    { name: "Morgan Lee", role: "VP, Operations", reports: ["Jorge Alvarez", "Dana Kim"] },
    { name: "Sam Patel", role: "VP, Engineering", reports: ["Sam Osei", "Tooling"] },
  ],
};

function OrgCard({ name, role }: { name: string; role: string }) {
  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-center">
      <p className="text-sm font-medium">{name}</p>
      <p className="text-xs text-muted-foreground">{role}</p>
    </div>
  );
}

export default function Home() {
  return (
    <KeyboardNavigablePage>
      <div className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-6 py-16">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Good morning, Mark</h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening on the floor today.</p>
        </header>

        <section data-keyboard-nav-section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Message from leadership */}
        <div className="col-span-2 flex flex-col rounded-xl bg-accent p-5 text-accent-foreground">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Quote className="size-4" /> Message from leadership
          </div>
          <blockquote className="mt-3 flex-1 text-lg leading-snug font-medium">
            “The part we make today is the reputation we carry tomorrow. Sweat the tenth of a
            millimeter.”
          </blockquote>
          <p className="mt-3 text-sm text-accent-foreground/80">— Morgan Lee, VP of Operations</p>
        </div>

        {/* What's for lunch */}
        <div className="col-span-2 rounded-xl p-5 ring-1 ring-foreground/10">
          <div className="flex items-center gap-2 text-sm font-medium">
            <UtensilsCrossed className="size-4 text-muted-foreground" /> Today&apos;s lunch
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Grilled chicken bowls, roasted vegetables, and a vegan chili.
          </p>
          <ul className="mt-3 space-y-2">
            {lunchSchedule.map(({ time, label, icon: Icon }) => (
              <li key={label} className="flex items-center gap-3 text-sm">
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                <span className="flex-1">{label}</span>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">{time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Next all-hands meeting */}
        <div className="col-span-2 flex items-center gap-4 rounded-xl border border-dashed p-5 md:col-span-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <CalendarDays className="size-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Next all-hands meeting</p>
            <p className="text-sm text-muted-foreground">
              Friday, Aug 1 · 3:00 PM · Main floor — Q3 numbers and the new line
            </p>
          </div>
          <Badge className="bg-accent text-accent-foreground">In 9 days</Badge>
        </div>

        {/* Machines */}
        <div className="col-span-2 rounded-xl p-5 ring-1 ring-foreground/10">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Factory className="size-4 text-muted-foreground" /> Machines
          </div>
          <ul className="mt-3 divide-y divide-border">
            {machines.map(({ name, status, href }) => {
              const inner = (
                <>
                  <span className={cn("size-2 shrink-0 rounded-full", statusDot[status])} />
                  <span className="flex-1 font-medium">{name}</span>
                  <span className="text-xs text-muted-foreground">{status}</span>
                </>
              );
              return (
                <li key={name}>
                  {href ? (
                    <Link
                      href={href}
                      className="group flex items-center gap-3 rounded-md py-2 text-sm outline-none hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring/50"
                    >
                      {inner}
                      <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 py-2 text-sm text-muted-foreground">
                      {inner}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mold storage */}
        <div className="col-span-2 rounded-xl p-5 ring-1 ring-foreground/10">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Box className="size-4 text-muted-foreground" /> Mold storage
          </div>
          <ul className="mt-3 space-y-1.5 text-sm">
            {moldStorage.map(({ name, rack, href }) => (
              <li key={name} className="flex items-baseline justify-between gap-2">
                {href ? (
                  <Link href={href} className="text-accent underline-offset-2 hover:underline">
                    {name}
                  </Link>
                ) : (
                  <span>{name}</span>
                )}
                <span className="shrink-0 text-xs text-muted-foreground">{rack}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Org chart */}
        <div className="col-span-2 rounded-xl p-5 ring-1 ring-foreground/10 md:col-span-4">
          <p className="text-sm font-medium">Org chart</p>
          <div className="mt-5 flex flex-col items-center overflow-x-auto">
            <OrgCard name={org.name} role={org.role} />
            <div className="h-5 w-px bg-border" aria-hidden />
            <div className="w-full max-w-2xl">
              <div className="mx-[16.666%] border-t border-border" aria-hidden />
              <div className="grid grid-cols-3">
                {org.reports.map((vp) => (
                  <div key={vp.name} className="flex flex-col items-center px-2">
                    <div className="h-5 w-px bg-border" aria-hidden />
                    <OrgCard name={vp.name} role={vp.role} />
                    <ul className="mt-2 space-y-1 text-center">
                      {vp.reports.map((r) => (
                        <li key={r} className="text-xs text-muted-foreground">
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="col-span-2 rounded-xl p-5 ring-1 ring-foreground/10 md:col-span-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Building2 className="size-4 text-muted-foreground" /> Active Customers
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Current accounts with active orders or recent activity.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Company</th>
                  <th className="pb-2 font-medium">Contact</th>
                  <th className="pb-2 font-medium">Email</th>
                  <th className="pb-2 text-right font-medium">Active Orders</th>
                  <th className="pb-2 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.map((customer) => (
                  <tr key={customer.name}>
                    <td className="py-2.5 font-medium">
                      {customer.href ? (
                        <Link
                          href={customer.href}
                          className="text-accent underline-offset-2 hover:underline"
                        >
                          {customer.name}
                        </Link>
                      ) : (
                        customer.name
                      )}
                    </td>
                    <td className="py-2.5 text-muted-foreground">{customer.contact}</td>
                    <td className="py-2.5 text-muted-foreground">{customer.email}</td>
                    <td className="py-2.5 text-right">{customer.activeOrders}</td>
                    <td className="py-2.5 text-right">
                      <Badge
                        variant={customer.status === "Active" ? "default" : "secondary"}
                        className={cn(
                          customer.status === "Active" && "bg-accent text-accent-foreground"
                        )}
                      >
                        {customer.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </section>
      </div>
    </KeyboardNavigablePage>
  );
}
