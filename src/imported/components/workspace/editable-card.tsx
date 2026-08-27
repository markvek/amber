"use client";

import { useState, type ReactNode } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface EditableCardProps {
  /** The content displayed in the card */
  children: ReactNode;
  /** Title shown in the edit sheet header */
  editTitle: string;
  /** Description shown in the edit sheet header */
  editDescription?: string;
  /** Content rendered inside the edit sheet */
  editContent: ReactNode;
  /** Additional class names for the card wrapper */
  className?: string;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Width of the sheet - defaults to sm:max-w-md */
  sheetWidth?: string;
  /** Aria label for the edit button */
  editLabel?: string;
}

/**
 * A card wrapper that shows an edit button on hover and opens a Sheet for editing.
 * Use this to make any card component editable with a consistent UI pattern.
 *
 * @example
 * ```tsx
 * <EditableCard
 *   editTitle="Edit stamp lifespan"
 *   editDescription="Update usage and rated life values"
 *   editContent={<StampLifespanForm />}
 * >
 *   <StampLifespanDisplay />
 * </EditableCard>
 * ```
 */
export function EditableCard({
  children,
  editTitle,
  editDescription,
  editContent,
  className,
  open: controlledOpen,
  onOpenChange,
  sheetWidth = "sm:max-w-md",
  editLabel = "Edit",
}: EditableCardProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  return (
    <div className={cn("group relative", className)}>
      {children}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon-sm"
            variant="ghost"
            className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100"
            aria-label={editLabel}
          >
            <Pencil className="size-3.5" />
          </Button>
        </SheetTrigger>
        <SheetContent className={cn("flex flex-col", sheetWidth)}>
          <SheetHeader>
            <SheetTitle>{editTitle}</SheetTitle>
            {editDescription && (
              <SheetDescription>{editDescription}</SheetDescription>
            )}
          </SheetHeader>
          {editContent}
        </SheetContent>
      </Sheet>
    </div>
  );
}

interface EditableCardTriggerProps {
  /** Class names for the trigger button */
  className?: string;
  /** Aria label for the edit button */
  "aria-label"?: string;
  children?: ReactNode;
}

/**
 * A standalone edit trigger button that can be placed anywhere in a card.
 * Use with Sheet components for custom positioning.
 */
export function EditableCardTrigger({
  className,
  "aria-label": ariaLabel = "Edit",
  children,
}: EditableCardTriggerProps) {
  return (
    <SheetTrigger asChild>
      <Button
        size="icon-sm"
        variant="ghost"
        className={className}
        aria-label={ariaLabel}
      >
        {children ?? <Pencil className="size-3.5" />}
      </Button>
    </SheetTrigger>
  );
}
