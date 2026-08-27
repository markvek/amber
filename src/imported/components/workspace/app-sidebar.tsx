"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, Fragment } from "react";
import {
  Box,
  Building2,
  CalendarDays,
  Factory,
  FileText,
  Flower,
  Folder,
  FolderOpen,
  FolderPlus,
  LayoutTemplate,
  Palette,
  Plus,
} from "lucide-react";

// Custom birdhouse icon component
function Birdhouse({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Roof */}
      <path d="M3 10 L12 3 L21 10" />
      {/* House body */}
      <path d="M5 10 L5 20 L19 20 L19 10" />
      {/* Entrance hole */}
      <circle cx="12" cy="14" r="2" />
      {/* Perch */}
      <path d="M12 16 L12 18" />
      {/* Pole */}
      <path d="M12 20 L12 22" />
    </svg>
  );
}

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  useWorkspace,
  type WorkspacePage,
  type WorkspaceSection,
} from "@/components/workspace/workspace-store";
import { cn } from "@/lib/utils";

const builtInIcons: Record<string, typeof FileText | typeof Birdhouse> = {
  home: Birdhouse,
  "machine-12": Factory,
  "marks-design-studio": Building2,
  "mx-4-housing": Box,
  globals: Palette,
  scaffolding: LayoutTemplate,
  "template-machine": LayoutTemplate,
  "template-customer": LayoutTemplate,
  "template-mold": LayoutTemplate,
  calendar: CalendarDays,
};

function PageIcon({ page }: { page: WorkspacePage }) {
  const Icon = builtInIcons[page.id] ?? FileText;
  return <Icon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />;
}

type DragState = {
  pageId: string;
  sectionId: string;
  index: number;
} | null;

type DropTarget = {
  sectionId: string;
  index: number;
  position: "before" | "after" | "inside";
  targetPageId?: string;
} | null;

/*
 * A tree row with rigid 90° guide lines: a vertical trunk segment on the left
 * (half-height on the last row, so the trunk ends in an `L`) and a horizontal
 * connector into the row content. Rows are h-7 (28px); the connector sits at 14px.
 */
function TreeRow({
  isLast,
  children,
  isDragging,
  isDropTarget,
  dropPosition,
  noConnector,
}: {
  isLast?: boolean;
  children: React.ReactNode;
  isDragging?: boolean;
  isDropTarget?: boolean;
  dropPosition?: "before" | "after" | "inside";
  /** Hide the horizontal connector line (for container rows with nested children) */
  noConnector?: boolean;
}) {
  return (
    <li
      className={cn(
        "relative pl-5",
        "before:absolute before:left-1 before:top-0 before:border-l before:border-border",
        isLast ? "before:h-[14px]" : "before:h-full",
        !noConnector && "after:absolute after:left-1 after:top-[14px] after:w-3 after:border-t after:border-border",
        isDragging && "opacity-50",
        isDropTarget && dropPosition === "before" && "before:!border-accent before:!border-l-2",
        isDropTarget && dropPosition === "after" && "after:!border-accent after:!border-t-2"
      )}
    >
      {isDropTarget && dropPosition === "before" && (
        <div className="absolute -top-0.5 left-5 right-0 h-0.5 rounded-full bg-accent" />
      )}
      {children}
      {isDropTarget && dropPosition === "after" && (
        <div className="absolute -bottom-0.5 left-5 right-0 h-0.5 rounded-full bg-accent" />
      )}
      {isDropTarget && dropPosition === "inside" && (
        <div className="absolute inset-0 left-5 rounded-md ring-2 ring-accent ring-inset" />
      )}
    </li>
  );
}

const rowClass =
  "flex h-7 w-full items-center gap-2 rounded-md px-1.5 text-sm outline-none hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring/50";

export function AppSidebar() {
  const { sections, addPage, addFolder, renamePage, reorderPage, movePage } = useWorkspace();
  const pathname = usePathname();
  const router = useRouter();

  const [dragState, setDragState] = useState<DragState>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const dragCounter = useRef(0);

  const handleAddPage = (sectionId: string) => {
    const page = addPage(sectionId);
    router.push(page.href);
  };

  const handleAddFolder = (sectionId: string) => {
    const folder = addFolder(sectionId);
    setExpandedFolders((prev) => new Set(prev).add(folder.id));
  };

  const handleAddPageToFolder = (sectionId: string, folderId: string) => {
    const page = addPage(sectionId, folderId);
    setExpandedFolders((prev) => new Set(prev).add(folderId));
    router.push(page.href);
  };

  const handleDragStart = (
    e: React.DragEvent,
    page: WorkspacePage,
    sectionId: string,
    index: number
  ) => {
    // Allow dragging all pages (including built-in) for reordering and folder placement
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", page.id);
    setDragState({ pageId: page.id, sectionId, index });
  };

  const handleDragEnd = () => {
    if (dragState && dropTarget) {
      const { sectionId: fromSection, index: fromIndex, pageId } = dragState;
      const { sectionId: toSection, index: toIndex, position, targetPageId } = dropTarget;

      // Find the page to check if it's built-in
      const section = sections.find((s) => s.id === fromSection);
      const page = section?.pages.find((p) => p.id === pageId);
      const isBuiltIn = page?.builtIn ?? false;

      if (position === "inside" && targetPageId && targetPageId !== pageId) {
        // Drop onto a folder: nest the page under it.
        movePage(pageId, toSection, undefined, targetPageId);
      } else {
        const actualToIndex = position === "after" ? toIndex + 1 : toIndex;

        if (fromSection === toSection) {
          // Reorder within same section (allowed for all pages)
          const adjustedIndex = fromIndex < actualToIndex ? actualToIndex - 1 : actualToIndex;
          if (fromIndex !== adjustedIndex) {
            reorderPage(fromSection, fromIndex, adjustedIndex);
          }
        } else if (!isBuiltIn) {
          // Move to different section (only allowed for custom pages)
          movePage(pageId, toSection, actualToIndex);
        }
      }
    }

    setDragState(null);
    setDropTarget(null);
    dragCounter.current = 0;
  };

  const handleDragOver = (
    e: React.DragEvent,
    sectionId: string,
    index: number,
    isFolder?: boolean,
    pageId?: string
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;

    let position: "before" | "after" | "inside" = "after";
    if (isFolder && y > height * 0.25 && y < height * 0.75) {
      position = "inside";
    } else if (y < height / 2) {
      position = "before";
    }

    setDropTarget({
      sectionId,
      index,
      position,
      targetPageId: position === "inside" ? pageId : undefined,
    });
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if we're leaving the entire drop zone
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDropTarget(null);
    }
  };

  const handleSectionDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleSectionDrop = (e: React.DragEvent, sectionId: string, pageCount: number) => {
    e.preventDefault();
    if (dragState) {
      const { sectionId: fromSection, pageId } = dragState;

      // Find the page to check if it's built-in
      const section = sections.find((s) => s.id === fromSection);
      const page = section?.pages.find((p) => p.id === pageId);

      // Only allow moving custom pages between sections (built-in pages stay in their section)
      if (fromSection !== sectionId && page && !page.builtIn) {
        movePage(pageId, sectionId, pageCount);
      }
    }
    handleDragEnd();
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const DraggablePageRow = ({
    page,
    sectionId,
    index,
    isLast,
  }: {
    page: WorkspacePage;
    sectionId: string;
    index: number;
    isLast?: boolean;
  }) => {
    const isDragging = dragState?.pageId === page.id;
    const isTarget = dropTarget?.sectionId === sectionId && dropTarget?.index === index;
    // Allow dragging all pages for reordering and folder placement
    const canDrag = true;
    const isFolder = !!page.isFolder;

    return (
      <TreeRow
        isLast={isLast}
        isDragging={isDragging}
        isDropTarget={isTarget && !isDragging}
        dropPosition={isTarget ? dropTarget?.position : undefined}
      >
        <div
          draggable={canDrag}
          onDragStart={(e) => handleDragStart(e, page, sectionId, index)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, sectionId, index, isFolder, page.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => {
            e.preventDefault();
            handleDragEnd();
          }}
          className={cn(
            "group/row flex items-center",
            canDrag && "cursor-grab active:cursor-grabbing"
          )}
        >
          {isFolder ? (
            <div className={cn(rowClass, "gap-1.5", !canDrag && "ml-4")}>
              <button
                type="button"
                onClick={() => toggleFolder(page.id)}
                aria-label={expandedFolders.has(page.id) ? "Collapse folder" : "Expand folder"}
                className="flex shrink-0 items-center outline-none"
              >
                {expandedFolders.has(page.id) ? (
                  <FolderOpen className="size-3.5 text-muted-foreground" />
                ) : (
                  <Folder className="size-3.5 text-muted-foreground" />
                )}
              </button>
              <input
                value={page.title}
                onChange={(e) => renamePage(page.id, e.target.value)}
                placeholder="Folder name"
                aria-label="Folder name"
                autoFocus={!page.title}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
              />
            </div>
          ) : (
            <Link
              href={page.href}
              data-sidebar-nav
              className={cn(
                rowClass,
                pathname === page.href && "bg-muted font-medium",
                !canDrag && "ml-4"
              )}
            >
              <PageIcon page={page} />
              <span className={cn("truncate", !page.title && "text-muted-foreground")}>
                {page.title || "Untitled"}
              </span>
            </Link>
          )}
        </div>
      </TreeRow>
    );
  };

  // Render a page row and, if it's an expanded folder, its child pages plus an
  // "Add page" action nested underneath.
  const renderNode = (page: WorkspacePage, section: WorkspaceSection, isLast?: boolean) => {
    const index = section.pages.findIndex((p) => p.id === page.id);
    const expanded = page.isFolder && expandedFolders.has(page.id);
    const children = page.isFolder
      ? section.pages.filter((p) => p.parentId === page.id)
      : [];

    return (
      <Fragment key={page.id}>
        <DraggablePageRow page={page} sectionId={section.id} index={index} isLast={isLast} />
        {expanded && (
          <TreeRow noConnector>
            <ul className="ml-1">
              {children.map((child) => (
                <DraggablePageRow
                  key={child.id}
                  page={child}
                  sectionId={section.id}
                  index={section.pages.findIndex((p) => p.id === child.id)}
                />
              ))}
              <TreeRow isLast>
                <button
                  type="button"
                  onClick={() => handleAddPageToFolder(section.id, page.id)}
                  className={cn(rowClass, "text-muted-foreground hover:text-foreground")}
                >
                  <Plus className="size-3.5 shrink-0" aria-hidden="true" />
                  <span>Add page</span>
                </button>
              </TreeRow>
            </ul>
          </TreeRow>
        )}
      </Fragment>
    );
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-dotted border-border">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Flower className="size-3.5" />
          </div>
          <span className="truncate text-sm font-semibold">Lily&apos;s Workspace</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sections.map((section) => {
          // Top-level pages only — folder children render nested under their folder.
          const topLevel = section.pages.filter((p) => !p.parentId);
          // In the design-system section, user-created pages are "layouts" and
          // nest one level deeper, under the Page Scaffolding entry.
          const nestLayouts = section.id === "design-system";
          const flatPages = nestLayouts
            ? topLevel.filter((p) => p.builtIn && !p.layout)
            : topLevel;
          const layouts = nestLayouts
            ? topLevel.filter((p) => !p.builtIn || p.layout)
            : [];

          return (
            <SidebarGroup
              key={section.id}
              className="border-b border-dotted border-border py-2 last:border-b-0"
              onDragOver={handleSectionDragOver}
              onDrop={(e) => handleSectionDrop(e, section.id, section.pages.length)}
            >
              <Collapsible defaultOpen>
                <CollapsibleTrigger
                  className={cn(rowClass, "font-medium")}
                  aria-label={`Toggle ${section.label} section`}
                >
                  {section.label}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ul className="ml-1 mt-0.5">
                    {flatPages.map((page) => renderNode(page, section))}
                    {nestLayouts && layouts.length > 0 && (
                      <TreeRow noConnector>
                        <ul className="ml-1">
                          {layouts.map((layout, idx) =>
                            renderNode(layout, section, idx === layouts.length - 1)
                          )}
                        </ul>
                      </TreeRow>
                    )}
                    <TreeRow>
                      <button
                        type="button"
                        onClick={() => handleAddPage(section.id)}
                        className={cn(rowClass, "ml-4 text-muted-foreground hover:text-foreground")}
                      >
                        <Plus className="size-3.5 shrink-0" aria-hidden="true" />
                        <span>{section.addLabel}</span>
                      </button>
                    </TreeRow>
                    <TreeRow isLast>
                      <button
                        type="button"
                        onClick={() => handleAddFolder(section.id)}
                        className={cn(rowClass, "ml-4 text-muted-foreground hover:text-foreground")}
                      >
                        <FolderPlus className="size-3.5 shrink-0" aria-hidden="true" />
                        <span>New folder</span>
                      </button>
                    </TreeRow>
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
