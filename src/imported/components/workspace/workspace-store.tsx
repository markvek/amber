"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type TemplateType = "machine" | "customer" | "mold";

export type WorkspacePage = {
  id: string;
  title: string;
  href: string;
  builtIn?: boolean;
  /** Built-in pages flagged as layouts nest under Page Scaffolding in the sidebar. */
  layout?: boolean;
  /** Parent page ID for nesting (folders) */
  parentId?: string;
  /** Marks this page as a folder: a container for child pages, not a navigable page. */
  isFolder?: boolean;
  /** Template type used to create this page */
  template?: TemplateType;
};

export type WorkspaceSection = {
  id: string;
  label: string;
  addLabel: string;
  pages: WorkspacePage[];
};

const SEED: WorkspaceSection[] = [
  {
    id: "workspace",
    label: "Workspace",
    addLabel: "Add new module",
    pages: [
      { id: "home", title: "Home", href: "/", builtIn: true },
      {
        id: "machine-12",
        title: "Injection Mold Machine 12",
        href: "/machine-12",
        builtIn: true,
      },
      {
        id: "marks-design-studio",
        title: "Marks Design Studio",
        href: "/customers/marks-design-studio",
        builtIn: true,
      },
      {
        id: "mx-4-housing",
        title: "MX-4 Housing — Rev C",
        href: "/molds/mx-4-housing",
        builtIn: true,
      },
    ],
  },
  {
    id: "calendar",
    label: "Calendar",
    addLabel: "Add event",
    pages: [
      { id: "calendar", title: "Calendar", href: "/calendar", builtIn: true },
    ],
  },
  {
    id: "design-system",
    label: "Design System and Layouts",
    addLabel: "Add a new layout",
    pages: [
      { id: "globals", title: "Globals", href: "/globals", builtIn: true },
      { id: "scaffolding", title: "Page Scaffolding", href: "/scaffolding", builtIn: true },
      {
        id: "template-machine",
        title: "Machine layout",
        href: "/templates/machine",
        builtIn: true,
        layout: true,
      },
      {
        id: "template-customer",
        title: "Customer layout",
        href: "/templates/customer",
        builtIn: true,
        layout: true,
      },
      {
        id: "template-mold",
        title: "Mold layout",
        href: "/templates/mold",
        builtIn: true,
        layout: true,
      },
    ],
  },
];

type CustomPage = {
  id: string;
  title: string;
  parentId?: string;
  template?: TemplateType;
  isFolder?: boolean;
};
type CustomPages = Record<string, CustomPage[]>;

// Track order of all pages (built-in + custom) per section
type PageOrder = Record<string, string[]>;

// Track parent assignments for built-in pages (when moved into folders)
type BuiltInParents = Record<string, string | undefined>;

const STORAGE_KEY = "workspace.custom-pages";
const ORDER_STORAGE_KEY = "workspace.page-order";
const BUILTIN_PARENTS_KEY = "workspace.builtin-parents";

type WorkspaceContextValue = {
  sections: WorkspaceSection[];
  ready: boolean;
  addPage: (sectionId: string, parentId?: string) => WorkspacePage;
  addFolder: (sectionId: string) => WorkspacePage;
  addPageFromTemplate: (template: TemplateType) => WorkspacePage;
  renamePage: (pageId: string, title: string) => void;
  getPage: (pageId: string) => WorkspacePage | undefined;
  deletePage: (pageId: string) => void;
  movePage: (pageId: string, toSectionId: string, toIndex?: number, parentId?: string) => void;
  reorderPage: (sectionId: string, fromIndex: number, toIndex: number) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [customPages, setCustomPages] = useState<CustomPages>({});
  const [pageOrder, setPageOrder] = useState<PageOrder>({});
  const [builtInParents, setBuiltInParents] = useState<BuiltInParents>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Hydration-safe: persisted data is only readable after mount, so the server
    // and first client render start empty, then localStorage fills them in.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setCustomPages(JSON.parse(raw));
    } catch {
      // corrupted storage — start clean
    }
    try {
      const orderRaw = window.localStorage.getItem(ORDER_STORAGE_KEY);
      if (orderRaw) setPageOrder(JSON.parse(orderRaw));
    } catch {
      // corrupted storage — start clean
    }
    try {
      const parentsRaw = window.localStorage.getItem(BUILTIN_PARENTS_KEY);
      if (parentsRaw) setBuiltInParents(JSON.parse(parentsRaw));
    } catch {
      // corrupted storage — start clean
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customPages));
  }, [customPages, ready]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(pageOrder));
  }, [pageOrder, ready]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(BUILTIN_PARENTS_KEY, JSON.stringify(builtInParents));
  }, [builtInParents, ready]);

  const sections = useMemo(() => {
    return SEED.map((section) => {
      // Combine built-in and custom pages, applying parent assignments to built-in pages
      const allPages: WorkspacePage[] = [
        ...section.pages.map((page) => ({
          ...page,
          parentId: builtInParents[page.id] ?? page.parentId,
        })),
        ...(customPages[section.id] ?? []).map((page) => ({
          ...page,
          href: `/p/${page.id}`,
        })),
      ];

      // Apply custom ordering if available
      const order = pageOrder[section.id];
      if (order && order.length > 0) {
        const pageMap = new Map(allPages.map((p) => [p.id, p]));
        const orderedPages: WorkspacePage[] = [];

        // Add pages in order
        for (const id of order) {
          const page = pageMap.get(id);
          if (page) {
            orderedPages.push(page);
            pageMap.delete(id);
          }
        }

        // Add any remaining pages not in order (new pages)
        for (const page of pageMap.values()) {
          orderedPages.push(page);
        }

        return { ...section, pages: orderedPages };
      }

      return { ...section, pages: allPages };
    });
  }, [customPages, pageOrder, builtInParents]);

  const addPage = useCallback((sectionId: string, parentId?: string) => {
    const page: CustomPage = {
      id: crypto.randomUUID().slice(0, 8),
      title: "",
      parentId,
    };
    setCustomPages((prev) => ({
      ...prev,
      [sectionId]: [...(prev[sectionId] ?? []), page],
    }));
    return { ...page, href: `/p/${page.id}` };
  }, []);

  const addFolder = useCallback((sectionId: string) => {
    const folder: CustomPage = {
      id: crypto.randomUUID().slice(0, 8),
      title: "",
      isFolder: true,
    };
    setCustomPages((prev) => ({
      ...prev,
      [sectionId]: [...(prev[sectionId] ?? []), folder],
    }));
    return { ...folder, href: `/p/${folder.id}` };
  }, []);

  const addPageFromTemplate = useCallback((template: TemplateType) => {
    const templateTitles: Record<TemplateType, string> = {
      machine: "New Machine",
      customer: "New Customer",
      mold: "New Mold",
    };
    const page: CustomPage = {
      id: crypto.randomUUID().slice(0, 8),
      title: templateTitles[template],
      template,
    };
    // Always add to workspace section
    setCustomPages((prev) => ({
      ...prev,
      workspace: [...(prev.workspace ?? []), page],
    }));
    return { ...page, href: `/p/${page.id}` };
  }, []);

  const renamePage = useCallback((pageId: string, title: string) => {
    setCustomPages((prev) => {
      const next: CustomPages = {};
      for (const [sectionId, pages] of Object.entries(prev)) {
        next[sectionId] = pages.map((p) => (p.id === pageId ? { ...p, title } : p));
      }
      return next;
    });
  }, []);

  const deletePage = useCallback((pageId: string) => {
    setCustomPages((prev) => {
      const next: CustomPages = {};
      for (const [sectionId, pages] of Object.entries(prev)) {
        next[sectionId] = pages.filter((p) => p.id !== pageId);
      }
      return next;
    });
    // Also remove from order
    setPageOrder((prev) => {
      const next: PageOrder = {};
      for (const [sectionId, order] of Object.entries(prev)) {
        next[sectionId] = order.filter((id) => id !== pageId);
      }
      return next;
    });
  }, []);

  const movePage = useCallback(
    (pageId: string, toSectionId: string, toIndex?: number, parentId?: string) => {
      // Find which section the page is currently in
      let fromSectionId: string | null = null;
      let isCustomPage = false;
      let isBuiltIn = false;

      for (const [sectionId, pages] of Object.entries(customPages)) {
        if (pages.some((p) => p.id === pageId)) {
          fromSectionId = sectionId;
          isCustomPage = true;
          break;
        }
      }

      // Check if it's a built-in page
      if (!fromSectionId) {
        for (const section of SEED) {
          if (section.pages.some((p) => p.id === pageId)) {
            fromSectionId = section.id;
            isBuiltIn = true;
            break;
          }
        }
      }

      if (!fromSectionId) return;

      // Only allow moving custom pages between sections
      if (isCustomPage && fromSectionId !== toSectionId) {
        setCustomPages((prev) => {
          const page = prev[fromSectionId!]?.find((p) => p.id === pageId);
          if (!page) return prev;

          const next: CustomPages = { ...prev };
          next[fromSectionId!] = (prev[fromSectionId!] ?? []).filter(
            (p) => p.id !== pageId
          );
          const updatedPage = { ...page, parentId };
          if (toIndex !== undefined) {
            const targetPages = [...(prev[toSectionId] ?? [])];
            targetPages.splice(toIndex, 0, updatedPage);
            next[toSectionId] = targetPages;
          } else {
            next[toSectionId] = [...(prev[toSectionId] ?? []), updatedPage];
          }
          return next;
        });
      }

      // Update page parent if moving into a folder
      if (parentId !== undefined) {
        if (isBuiltIn) {
          // For built-in pages, track parent separately
          setBuiltInParents((prev) => ({
            ...prev,
            [pageId]: parentId || undefined,
          }));
        } else {
          // For custom pages, update the parentId directly
          setCustomPages((prev) => {
            const next: CustomPages = {};
            for (const [sectionId, pages] of Object.entries(prev)) {
              next[sectionId] = pages.map((p) =>
                p.id === pageId ? { ...p, parentId: parentId || undefined } : p
              );
            }
            return next;
          });
        }
      }

      // Update order in the target section
      if (toIndex !== undefined) {
        setPageOrder((prev) => {
          const section = sections.find((s) => s.id === toSectionId);
          if (!section) return prev;

          const currentOrder = prev[toSectionId] ?? section.pages.map((p) => p.id);
          const newOrder = currentOrder.filter((id) => id !== pageId);
          newOrder.splice(toIndex, 0, pageId);

          return { ...prev, [toSectionId]: newOrder };
        });
      }
    },
    [customPages, sections]
  );

  const reorderPage = useCallback(
    (sectionId: string, fromIndex: number, toIndex: number) => {
      setPageOrder((prev) => {
        const section = sections.find((s) => s.id === sectionId);
        if (!section) return prev;

        const currentOrder = prev[sectionId] ?? section.pages.map((p) => p.id);
        const newOrder = [...currentOrder];
        const [movedId] = newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, movedId);

        return { ...prev, [sectionId]: newOrder };
      });
    },
    [sections]
  );

  const getPage = useCallback(
    (pageId: string) => {
      for (const section of sections) {
        const page = section.pages.find((p) => p.id === pageId);
        if (page) return page;
      }
      return undefined;
    },
    [sections]
  );

  const value = useMemo(
    () => ({ sections, ready, addPage, addFolder, addPageFromTemplate, renamePage, getPage, deletePage, movePage, reorderPage }),
    [sections, ready, addPage, addFolder, addPageFromTemplate, renamePage, getPage, deletePage, movePage, reorderPage]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within a WorkspaceProvider");
  return ctx;
}
