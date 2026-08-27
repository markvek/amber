import { PlaceholderRows } from "@/components/workspace/template-fields";
import { cn } from "@/lib/utils";

export type MaintenanceColumn = {
  label: string;
  /** Real rows: an optional leading icon and the row content. */
  items?: { icon?: React.ReactNode; text: React.ReactNode }[];
  /** When there are no items, render this many blank skeleton rows instead. */
  placeholderCount?: number;
};

/**
 * A titled, three-up checklist card — used for maintenance logs and check lists
 * across machine and mold pages. Each column either lists real rows or, when a
 * page is a blank template, shows placeholder skeleton rows.
 *
 * The outer box carries no grid-span by default; pass `className` (e.g.
 * "col-span-2 md:col-span-4") when placing it inside a page's column grid.
 */
export function MaintenanceBoard({
  title = "Maintenance",
  columns,
  className,
}: {
  title?: string;
  columns: MaintenanceColumn[];
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl p-5 ring-1 ring-foreground/10", className)}>
      <p className="text-sm font-medium">{title}</p>
      <div className="mt-4 grid gap-6 sm:grid-cols-3">
        {columns.map((column) => (
          <div key={column.label}>
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              {column.label}
            </p>
            {column.items ? (
              <ul className="mt-2.5 space-y-2 text-sm">
                {column.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    {item.icon}
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <PlaceholderRows count={column.placeholderCount ?? 3} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
