"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

import { KeyboardNavigablePage } from "@/components/KeyboardNavigablePage";
import { ScaffoldBuilder, type ScaffoldBox } from "@/components/scaffold/scaffold-builder";
import { Skeleton } from "@/components/ui/skeleton";
import { PageEditButton } from "@/components/workspace/page-edit-button";
import { TemplateContent } from "@/components/workspace/template-content";
import { useWorkspace } from "@/components/workspace/workspace-store";

function usePageBoxes(pageId: string) {
  const [boxes, setBoxes] = useState<ScaffoldBox[] | null>(null);

  useEffect(() => {
    const key = `page-boxes.${pageId}`;
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) {
        setBoxes(JSON.parse(stored));
      } else {
        // Default boxes for new pages
        setBoxes([
          { id: "initial-full", width: 4, content: "empty" },
          { id: "initial-half-1", width: 2, content: "empty" },
          { id: "initial-half-2", width: 2, content: "empty" },
        ]);
      }
    } catch {
      setBoxes([
        { id: "initial-full", width: 4, content: "empty" },
        { id: "initial-half-1", width: 2, content: "empty" },
        { id: "initial-half-2", width: 2, content: "empty" },
      ]);
    }
  }, [pageId]);

  return boxes;
}

export default function WorkspacePageView() {
  const { id } = useParams<{ id: string }>();
  const { getPage, renamePage, ready } = useWorkspace();
  const boxes = usePageBoxes(id);

  if (!ready || boxes === null) {
    return (
      <div className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-8 py-16">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  const page = getPage(id);

  if (!page) {
    return (
      <div className="mx-auto w-full max-w-3xl flex-1 px-8 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-2 text-muted-foreground">
          This page doesn&apos;t exist in your workspace — it may have been created in a
          different browser.
        </p>
      </div>
    );
  }

  // If this page was created from a template, show template content
  if (page.template) {
    return (
      <KeyboardNavigablePage>
        <div className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-6 py-16">
          <header className="space-y-2">
            <div className="flex items-start gap-4">
              <input
                autoFocus={!page.title}
                value={page.title}
                onChange={(e) => renamePage(page.id, e.target.value)}
                placeholder="Untitled"
                aria-label="Page title"
                className="min-w-0 flex-1 bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-muted-foreground/40"
              />
              <PageEditButton />
            </div>
            <p className="text-muted-foreground">
              Fill in each field to complete this {page.template} record.
            </p>
          </header>
          <section data-keyboard-nav-section>
            <TemplateContent template={page.template} />
          </section>
        </div>
      </KeyboardNavigablePage>
    );
  }

  // Standard page with ScaffoldBuilder
  return (
    <KeyboardNavigablePage>
      <div className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-6 py-16">
        <header className="space-y-2">
          <div className="flex items-start gap-4">
            <input
              autoFocus={!page.title}
              value={page.title}
              onChange={(e) => renamePage(page.id, e.target.value)}
              placeholder="Untitled"
              aria-label="Page title"
              className="min-w-0 flex-1 bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-muted-foreground/40"
            />
            <PageEditButton />
          </div>
          <p className="text-muted-foreground">
            Click the + in any box to add content from the component library.
          </p>
        </header>
        <section data-keyboard-nav-section>
          <ScaffoldBuilder initialBoxes={boxes} pageId={id} />
        </section>
      </div>
    </KeyboardNavigablePage>
  );
}
